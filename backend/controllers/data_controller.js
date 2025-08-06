// server/controllers/userHealthDatas.controller.js
import UserHealthData from "../models/note.js";
import OpenAI from "openai";
import dailyEntry from "../models/daily_note.js";
import dotenv from 'dotenv';
// import puppeteer from 'puppeteer'
import { generateWorkoutPlanHTML } from "./workoutPlan.js";
import { marked } from 'marked'; 
// import chromium from 'chrome-aws-lambda';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

dotenv.config();

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const dailyData = async (req, res) => {
    try {
        const { userId } = req; // set via Clerk middleware
        const clerkUserId = userId;
        console.log(clerkUserId)
        const {
            date,
            bodyWeight,
            caloriesConsumed,
            caloriesBurned
        } = req.body;

        const newData = new dailyEntry({
            userId:clerkUserId,
            date,
            bodyWeight,
            caloriesConsumed,
            caloriesBurned
        });

        await newData.save();
        res.status(201).json({ message: "Health data saved successfully", data: newData });
    } catch (error) {
        console.error("Error saving health data:", error);
        res.status(500).json({ message: "Server error while saving health data" });
    }
};
// POST /api/health-data
export const insertData = async (req, res) => {
    try {
        const {userId} = req; // set via Clerk middleware
        const clerkUserId = userId;
        console.log(clerkUserId)
        const {
            name,
            age,
            gender,
            weight,
            height,
            goalWeight,
            healthConditions,
            dailyActivityLevel,
            wantsGym,
            endGoal,
            currentDiet,
            isVegetarian,
            
        } = req.body;

        // Check if data already exists
        // const existingData = await UserHealthData.findOne({ clerkUserId });

        // if (existingData) {
        //     // Update existing entry
        //     existingData.age = age;
        //     existingData.weight = weight;
        //     existingData.healthConditions = healthConditions;
        //     existingData.dailyActivityLevel = dailyActivityLevel;
        //     existingData.wantsGym = wantsGym;
        //     existingData.endGoal = endGoal;
        //     existingData.currentDiet = currentDiet;
        //     existingData.isVegetarian = isVegetarian;

        //     await existingData.save();
        //     return res.status(200).json({ message: "Health data updated successfully", data: existingData });
        // }

        // const response = await AI.chat.completions.create({
        //     model: "gemini-2.0-flash",
        //     messages: [

        //         {
        //             role: "user",
        //             content: ``,
        //         },
        //     ],
        //     temperature: 0.7,
        //     max_tokens: length, // Adjust as needed
        // });



        // Create new entry

        const prompt = `
You are a professional nutritionist. Based on the following user profile, generate a personalized daily diet plan:

User Profile:
- Age: ${age}
- Weight: ${weight} kg
- Height: ${height} cm
- Goal Weight: ${goalWeight} kg
- Health Conditions: ${healthConditions || "None"}
- Daily Activity Level: ${dailyActivityLevel}
- Wants to go to gym: ${wantsGym ? "Yes" : "No"}
- End Goal: ${endGoal}
- Current Diet: ${currentDiet}
- Is Vegetarian: ${isVegetarian ? "Yes" : "No"}

Instructions:
1. Generate a full-day meal plan including breakfast, lunch, dinner, and snacks.
2. Suggest approximate calories per meal and total daily calories.
3. Focus on foods that match the user's dietary preference (vegetarian/non-vegetarian).
4. If the user wants to go to the gym and their goal is muscle gain, prioritize high-protein meals.
5. If the user has health conditions, avoid foods that worsen them.
6. Keep the diet simple and based on commonly available foods.

Output in a clear, bullet-point format under these sections:
- Breakfast
- Mid-Morning Snack
- Lunch
- Evening Snack
- Dinner
- Summary (daily calorie estimate and nutrition tips)
- Keep the diet plan Indian (Indian foods)
- at the end show How much calories to intake based on the end goal of user (calorie deficit for weightloss, calorie surplus for weight gain)
****GIVE THE OUTPUT IN HTML FORMAT ONLY!!! Keep this in dark theme. use table format if needed and keep it goodlooking****
mention the user profile on the top.
`;
        
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [

                {
                    role: "user",
                    content: `${prompt}`,
                },
            ],
            temperature: 0.7,
            
        });

        
        const prompt2 = `

User Profile:
- Age: ${age}
- Weight: ${weight} kg
- Height: ${height} cm
- Goal Weight: ${goalWeight} kg
- Health Conditions: ${healthConditions || "None"}
- Daily Activity Level: ${dailyActivityLevel}
- Wants to go to gym: ${wantsGym ? "Yes" : "No"}
- End Goal: ${endGoal}
- Current Diet: ${currentDiet}


Requirements:
0. If they are not interested in going to the gym, suggest accordingly (walking, running, etc.).
1. Create the plan on the basis of End Goal of user. 
2. Use the format of Push Pull Legs. 
3. give atleast 1 compund movement each day.
4. Use this exact table structure with the same column headers
5. Format days as bold (**Monday**)
6. List exercises with bullet points (• Exercise) and line breaks (<br>) between exercises
7. For cardio days specify "30-45 minutes moderate cardio (jogging, cycling, elliptical)"
8. For rest days specify "Active Recovery (Light Walk)"
9. Sets/Reps should be "3 sets of 10-12 reps" for strength exercises, "N/A" for cardio/rest
10. Notes should include "Focus on proper form, Rest 60-90 seconds between sets" for workout days
11. Maintain conversational pace" for cardio days
****GIVE THE OUTPUT IN HTML FORMAT ONLY!!! Keep this in dark theme. make the workout plan in table format and keep it goodlooking****
`;
        
        const response2 = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [

                {
                    role: "user",
                    content: `${prompt2}`,
                },
            ],
            temperature: 0.7,

        });

        const dietPlan = response.choices[0].message.content;
        const gymPlan = response2.choices[0].message.content;




        // 🔢 Calculate BMR
        let bmr;
        if (gender.toLowerCase() === "male") {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else if (gender.toLowerCase() === "female") {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        } else {
            bmr = 0;
        }

        // ⚙️ Define activity multipliers
        const activityMultipliers = {
            sedentary: 1.2, 
            light: 1.375,
            moderate: 1.55,
            high: 1.725,
            // super_active: 1.9
        };

        const multiplier = activityMultipliers[dailyActivityLevel.toLowerCase()] || 1.2;

        // 🔥 Final Maintenance Calories
        const m_cal = Math.round(bmr * multiplier);

        const newData = new UserHealthData({
            clerkUserId,
            name,
            age,
            gender,
            weight,
            height,
            goalWeight,
            healthConditions,
            dailyActivityLevel,
            wantsGym,
            endGoal,
            currentDiet,
            isVegetarian,
            dietPlan,
            gymPlan,
            m_cal
        });

        const today = new Date();

        const newData2 = new dailyEntry({
            userId:clerkUserId,
            date: today,
            bodyWeight:weight,
            caloriesConsumed: null,
            caloriesBurned: null,
        });
        await newData2.save();
        await newData.save();
        res.status(201).json({ message: "Health data saved successfully", data: newData, data2 : newData2 });
    } catch (err) {
        console.error("Error saving health data:", err);
        res.status(500).json({ message: "Server error while saving health data" });
    }
};

export const getData = async (req, res) => {
    try {
        const { userId } = req; // set via Clerk middleware
        const clerkUserId = userId;


        const data = await UserHealthData.findOne({ clerkUserId })
            .sort({ createdAt: -1 })
            .limit(1);
        if (!data) return res.status(404).json({ message: "No health data found for this user" });

        res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching health data:", err);
        res.status(500).json({ message: "Server error while fetching health data" });
    }
};

export const getDailyData = async (req, res) => {
    try {
        const { userId } = req; // set via Clerk middleware
        const clerkUserId = userId;


        const entries = await dailyEntry.find({ userId:clerkUserId }).sort({ date: -1 }); // Newest first

        if (!entries) return res.status(404).json({ message: "No health data found for this user" });

        res.status(200).json(entries);
    } catch (err) {
        console.error("Error fetching health data:", err);
        res.status(500).json({ message: "Server error while fetching daily user data" });
    }
};

// utils/generateHTML.js

// const generateDietPlanHTML = (markdownString) => {
//     const styledHTML = `
//     <html>
//       <head>
//         <style>
//           body {
//             font-family: 'Arial', sans-serif;
//             padding: 40px;
//             line-height: 1.7;
//             color: #333;
//           }
//           h1 {
//             text-align: center;
//             color: #4A90E2;
//             margin-bottom: 30px;
//           }
//           h2 {
//             color: #2E86C1;
//             margin-top: 30px;
//           }
//           strong {
//             font-weight: bold;
//           }
//           em {
//             font-style: italic;
//           }
//           ul {
//             margin-left: 20px;
//             padding-left: 10px;
//           }
//           li {
//             margin-bottom: 8px;
//           }
//           p {
//             margin-bottom: 12px;
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Personalised Diet Plan</h1>
//         <div>
//           ${markdownString
//             .replace(/\*\*\*(.*?)\*\*\*/g, "<h2>$1</h2>") // triple asterisks = section heading
//             .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // double asterisks = bold
//             .replace(/\*(.*?)\*/g, "<li>$1</li>") // single asterisk = list item
//             .replace(/\n/g, "<br/>")} <!-- optional for line breaks -->
//         </div>
//       </body>
//     </html>
//   `;

//     return styledHTML;
// };

export const generateDietPlanHTML = (contentFromBackend) => {
    
    return contentFromBackend;
};


export const pdf = async (req, res) => {
    const { userId } = req; // set via Clerk middleware
    const clerkUserId = userId;
    const dietData = await UserHealthData.findOne({ clerkUserId }); // adjust as needed
    const Plan = marked.parse(dietData.dietPlan); // ✅ Convert Markdown to HTML

    const htmlContent = generateDietPlanHTML(Plan); // assume it's an array of items

    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(), // ✅ Vercel will resolve this internally,
        headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="diet plan.pdf"',
        "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
};



export const gym_pdf = async (req, res) => {
    const { userId } = req; // set via Clerk middleware
    const clerkUserId = userId;
    const Data = await UserHealthData.findOne({ clerkUserId }).lean(); // adjust as needed
    const Plan = marked.parse(Data.gymPlan); // ✅ Convert Markdown to HTML

    const htmlContent = generateWorkoutPlanHTML(Plan); // assume it's an array of items
    // console.log(Plan)

    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    res.setHeader('Content-Type', 'application/json');

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Gym plan.pdf"',
        "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
};

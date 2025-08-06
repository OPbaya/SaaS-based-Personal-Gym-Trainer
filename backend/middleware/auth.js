import { clerkClient, getAuth } from "@clerk/express";

export const auth = async (req, res, next) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // const hasPremiumPlan = await has({ plan: 'premium1' });
        const user = await clerkClient.users.getUser(userId);

        // if (!hasPremiumPlan && user.privateMetadata.free_usage !== undefined) {
        //     req.free_usage = user.privateMetadata.free_usage;
        // } else {
        //     await clerkClient.users.updateUserMetadata(userId, {
        //         privateMetadata: {
        //             free_usage: 0,
        //         }
        //     });
        //     req.free_usage = 0;
        // }

        req.userId = userId;
        console.log(userId);
        // req.plan = hasPremiumPlan ? 'Premium' : 'Free'; // Adjust based on your plan logic
        // console.log("Plan:", hasPremiumPlan);
        // console.log("User Metadata:", {
        //     public: user.publicMetadata,
        //     private: user.privateMetadata
        // });

        next(); // Proceed regardless of plan status
    } catch (error) {
        res.json({ success: false, error: error.message });
        console.error("Authentication error:", error);
    }
};

const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequest = require("../model/sendConnection");
const sendEmail = require("./sendEmail");

//it will run 8:00 am  in the morning
// sec min hour day month year
cron.schedule("0 8 * * *", async () => {
    // Send emails to all people who got request on the previous day
    try {
        const yesterday = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await ConnectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lte: yesterdayEnd
            }
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingRequests?.map(req => req.toUserId.emailId))];
        console.log(listOfEmails)
        for (const email of listOfEmails) {
            try {
                const res = await sendEmail.run("New Friend Requests Pending for " + email,
                    "There are so many requests pending , please login to devrahul.xyz and complete it"
                );
                console.log(res)
            }
            catch (err) {
                console.log(err)
            }
        }

    }
    catch (err) {
        console.error(err)
    }
})

const mongoose = require("mongoose");
const User = require("./models/userModel"); 
const QuizAttempt = require("./models/quizAttemptSchema");

mongoose.connect('mongodb://localhost:27017/Hackpalloti').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});



const updateAverageScores = async () => {
    try{
        const users = await User.find({});
        let number = 1;
        for (let user of users) {
            const quizAttempts = await QuizAttempt.find({ user: user._id });

            const totalScore = quizAttempts.reduce((acc, attempt) => {
                return acc + attempt.score;
            }, 0);

            const averageScore = totalScore / quizAttempts.length;

            User.updateOne({ _id: user._id }, { $set: { avg_score: averageScore } });
            await user.save();
            console.log(`${number}. Updated average score for user ${user.name}`);
            number++;
        }

    }catch(e) {
        console.error('Error updating average scores', e);
    }
}

updateAverageScores().then(() => {
    console.log('Average scores updated successfully');
    mongoose.connection.close();
}).catch(e => {
    console.error('Error updating average scores', e);
    mongoose.connection.close();
});

const mongoose = require('mongoose');
const User = require('./models/userModel');
const Roadmap = require('./models/roadmapModel');
const Quiz = require('./models/quizModel');
const QuizAttempt = require('./models/quizAttemptSchema');
const bcrypt = require('bcryptjs');
const Checkpoint = require('./models/checkpointSchema');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const genAi = new GoogleGenerativeAI(process.env.LLM_API_KEY);
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" })

const usersFilePath = path.join(__dirname, 'users.json');
const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
console.log(`Number of users: ${usersData.length}`);

mongoose.connect('mongodb://localhost:27017/Hackpalloti').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

const createUsers = async function () {
    try {
        let uniqueDomainInterests = new Set();

        for (const user of usersData) {
            const newUser = new User(user);
            const hashedPassword = await bcrypt.hash(newUser.password, 10);
            newUser.password = hashedPassword;

            for (const domainInterest of newUser.learningParameters.domainInterest) {
                uniqueDomainInterests.add(domainInterest);
            }

            await newUser.save();
            console.log(`User ${newUser.name} created`);
        }
        console.log(`Number of unique domain interests: ${uniqueDomainInterests.size}`);
        fs.writeFileSync(path.join(__dirname, 'domainInterests.json'), JSON.stringify(Array.from(uniqueDomainInterests), null, 2));
    }
    catch (e) {
        console.error('Error creating users', e);
    }
    finally {
        mongoose.connection.close();
    }
}

const createRoadmaps = async function () {
    try {
        const users = usersData;

        for (const user of users) {
            const _login = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password,
                })
            });
            const data = await _login.json();
            const _user = data.data;

            if (_user.roadmaps.length >= 2) {
                console.log(`Roadmaps already created for user ${user.name}`);
                continue;
            }

            const token = data.token;

            const roadmaps = [];
            for (let i = 0; i < 2; i++) {
                const prompt = `give a topic related to ${user.learningParameters.domainInterest[Math.floor(Math.random() * user.learningParameters.domainInterest.length)]}
                    only give two topics as output nothing else. 
                `;
                const result = await model.generateContent(prompt);
                const _response = result.response;
                const topic = _response.text();


                const response = await fetch(`http://localhost:5000/api/roadmaps/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        user: user._id,
                        topic: topic,
                    })
                })
                if (response.ok) {
                    const data = await response.json();
                    roadmaps.push(data._id);

                    console.log(`Roadmap created for user ${user.name}`);
                }

            }
            console.log("\n\n");
        }
    } catch (e) {
        console.error('Error creating roadmaps', e);
    }
    finally {
        mongoose.connection.close();
    }
}

const randomlyCompleteCheckpoints = async function () {
    try {
        const users = usersData;
        for (const user of users) {
            const _login = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password,
                })
            });
            const data = await _login.json();
            let _user = data.data;


            const token = data.token;
            _user = await User.findOne({ _id: _user._id }).populate('roadmaps');

            for (const roadmap of _user.roadmaps) {
                const numberOfCheckPointsToBeCompleted = Math.floor(Math.random() * roadmap.checkpoints.length) + 1;
                console.log(numberOfCheckPointsToBeCompleted);
                for (let i = 0; i < numberOfCheckPointsToBeCompleted; i++) {
                    const res = await fetch(`http://localhost:5000/api/roadmaps/update-checkpoint-status`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            roadmapId: roadmap,
                            checkpointId: roadmap.checkpoints[i],
                            status: 'completed'
                        })
                    });

                    if (res.ok) {
                        console.log(`Checkpoint ${i} for roadmap ${roadmap.mainTopic} completed for user ${user.name}`);
                    } else {
                        console.log(`Error completing checkpoint ${i} for roadmap ${roadmap.mainTopic} for user ${user.name}`, res.statusText);
                    }
                }
                console.log("\n");
            }
        }

    } catch (e) {
        console.error('Error completing checkpoints', e);
    }
    finally {
        mongoose.connection.close()
    }

}

const updateProgress = async function () {
    try {
        const users = usersData;
        for (const user of users) {
            const _login = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password,
                })
            });
            const data = await _login.json();
            let _user = data.data;

            _user = await User.findOne({ _id: _user._id }).populate('roadmaps');
            _user = await _user.populate('roadmaps.checkpoints');

            for (const roadmap of _user.roadmaps) {
                const completedCheckpoints = roadmap.checkpoints.filter(checkpoint => checkpoint.status === 'completed');
                const progress = completedCheckpoints.length;
                roadmap.totalProgress = progress;
                await roadmap.save();
                console.log(`Progress updated for roadmap ${roadmap.mainTopic} for user ${user.name}`);
            }
        }
    } catch (e) {
        console.error('Error updating progress', e);
    }
    finally {
        mongoose.connection.close();
    }
}

const createQuizzes = async function () {
    try {
        const users = usersData;
        let count = 0;
        for (const user of users) {
            const _login = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password,
                })
            });
            const data = await _login.json();
            let _user = data.data;


            const token = data.token;
            _user = await User.findOne({ _id: _user._id }).populate('roadmaps');
            _user = await _user.populate('roadmaps.checkpoints');

            const difficulties = ['beginner', 'intermediate', 'advanced'];

            for (const roadmap of _user.roadmaps) {
                const prompt = `give a json of two fields related to ${roadmap.mainTopic} topic. these fields are "domain" and "tags" tags should be array of not more than 3 strings.
                domain should be a string capturing high level idea of the topic. this would basically be used as metadata for identifying quiz on this topic.
                `;

                const result = await model.generateContent(prompt);
                let text = result.response.text();
                text = text.replace("```json\n", "");
                text = text.replace("```", "");
                text = text.replace("```JSON", "")

                console.log(text);
                const data = JSON.parse(text);
                const domain = data.domain;
                const tags = data.tags;


                const res = await fetch(`http://localhost:5000/api/quiz/generate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: `Quiz on ${roadmap.mainTopic}`,
                        topic: roadmap.mainTopic,
                        domain: domain,
                        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
                        tags: tags
                    })
                });

                if (res.ok) {
                    const quiz = await res.json();
                    console.log(`Quiz created for roadmap ${roadmap.mainTopic} for user ${user.name}`);
                } else {
                    console.log(`Error creating quiz for ${roadmap.mainTopic} for user ${user.name}`, res.statusText);
                }


            }

            if (count % 20 == 0) {
                setTimeout(() => {
                    console.log("Waiting for 5 minutes");
                }, 5 * 60 * 1000);
            }

        }

    } catch (e) {
        console.error('Error creating quizzes', e);
    }
    finally {
        mongoose.connection.close();
    }
}

const updateSurveyParams = async function () {
    /*
    surveyParameters: {
        visualLearning: {
            type: Number,
            required: true,
        },
        auditoryLearning: {
            type: Number,
            required: true,
        },
        readingWritingLearning: {
            type: Number,
            required: true,
        },
        kinestheticLearning: {
            type: Number,
            required: true,
        },
        challengeTolerance: {
            type: Number,
            required: true,
        },
        timeCommitment: {
            type: Number,
            required: true,
        },
        learningPace: {
            type: Number,
            required: true,
        },
        socialPreference: {
            type: Number,
            required: true,
        },
        feedbackPreference: {
            type: Number,
            required: true,
        },
    }
    */
    try {
        const users = usersData;
        /*
        we have to randomly generate values for the survey parameters for each user
        */

        for (const user of users) {
            const _login = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password,
                })
            });
            const data = await _login.json();
            let _user = data.data;

            const token = data.token;
            _user = await User.findOne({ _id: _user._id });

            const surveyParams = {
                visualLearning: Math.floor(Math.random() * 10) + 1,
                auditoryLearning: Math.floor(Math.random() * 10) + 1,
                readingWritingLearning: Math.floor(Math.random() * 10) + 1,
                kinestheticLearning: Math.floor(Math.random() * 10) + 1,
                challengeTolerance: Math.floor(Math.random() * 10) + 1,
                timeCommitment: Math.floor(Math.random() * 10) + 1,
                learningPace: Math.floor(Math.random() * 10) + 1,
                socialPreference: Math.floor(Math.random() * 10) + 1,
                feedbackPreference: Math.floor(Math.random() * 10) + 1,
            }

            await _user.updateOne({ surveyParameters: surveyParams });
            console.log(`Survey parameters updated for user ${user.name}`);
        }

    } catch (e) {
        console.error('Error updating survey parameters', e);
    } finally {
        mongoose.connection.close();
    }


}


// createUsers();
// createRoadmaps();
// randomlyCompleteCheckpoints();
// updateProgress();
// createQuizzes();
updateSurveyParams();
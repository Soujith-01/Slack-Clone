import exp from 'express'
import { chatModel } from "../models/ChatModel.js";
import { verifyToken } from '../middlewares/verifyToken.js';
import { UserModel } from '../models/UserModel.js';
import { Types } from 'mongoose';

export const chatApp = exp.Router()

//create new channel
chatApp.post("/chats/channel", verifyToken, async (req, res) => {

    const { type, channelName, members } = req.body;

    if (!channelName) {
        return res.status(400).json({
            message: "channel name is required",
        });
    }

    if (!members || members.length === 0) {
        return res.status(400).json({
            message:
                "minimum 1 members is required to create a channel",
        });
    }

    const adminId = req.user.userId;

    const users = await UserModel.find({
        email: { $in: members },
    });

    const foundEmails = users.map((user) => user.email);

    const invalidEmails = members.filter(
        (email) => !foundEmails.includes(email)
    );

    if (invalidEmails.length > 0) {
        return res.status(400).json({
            message: "some emails are invalid",
            invalidEmails,
        });
    }

    const memberIds = users.map((user) => user._id);

    const newChannel = await chatModel.create({
        channelName,
        type,
        members: [...memberIds, adminId],
        admin: adminId,
    });

    res.status(200).json({
        message: "channel successfully created",
        payload: newChannel,
    });
});

//create new dm
chatApp.post('/chats/dm', verifyToken, async (req, res) => {

    const userId = req.user.userId;

    const newUser = req.body.members;

    const existingUser = await UserModel.findById(newUser)

    if (!existingUser) {
        return res.status(400).json({ message: "user not existed" })
    }

    if (userId.toString() === newUser) {
        return res.status(400).json({ message: "cannot create dm for current user" })
    }

    const members = [userId.toString(), newUser]

    const existingDm = await chatModel.findOne({
        type: "dm",
        members: { $all: members, $size: 2 }
    })

    if (existingDm) {
        return res.status(400).json({
            message: "dm already exists",
            payload: existingDm
        })
    }

    const newDm = await chatModel.create({
        type: 'dm',
        members
    })

    res.status(200).json({
        message: "dm created successfully",
        payload: newDm
    })
})

//get channel List
chatApp.get('/chats/channels', verifyToken, async (req, res) => {

    const userId = req.user.userId

    const channelChats = await chatModel
        .find({
            type: "channel",
            members: userId
        })
        .populate(
            "joinRequests.user",
            "username email"
        )

    res.status(200).json({
        message: "chats",
        payload: channelChats
    })
})

//get dms
chatApp.get('/chats/dms', verifyToken, async (req, res) => {

    const userId = req.user.userId

    const dmChats = await chatModel
        .find({
            type: "dm",
            members: userId
        })
        .populate(
            "members",
            "username email profileImage"
        );

    res.status(200).json({
        message: "chats",
        payload: dmChats
    })
})

//search channels
chatApp.get('/channels/search', verifyToken, async (req, res) => {

    const { name = "" } = req.query;

    if (!name.trim()) {
        return res.status(200).json({
            payload: []
        });
    }

    const channels = await chatModel.find({
        type: "channel",
        channelName: {
            $regex: name,
            $options: "i"
        },
    });

    res.status(200).json({
        payload: channels
    })
})

//update channel name
chatApp.patch('/channel', verifyToken, async (req, res) => {

    const { oldName, newName } = req.body

    const user = req.user.userId

    const channel = await chatModel.findOne({
        channelName: oldName
    })

    if (user != channel.admin) {
        return res.status(403).json({
            message: "only admin can change the channel name"
        })
    }

    const updatedChannel =
        await chatModel.findOneAndUpdate(
            { channelName: oldName },
            {
                $set: {
                    channelName: newName
                }
            },
            { new: true }
        )

    res.status(200).json({
        message: "channel name upddated",
        payload: updatedChannel
    })
})

//delete channel
chatApp.delete('/delete', verifyToken, async (req, res) => {

    const { channelName } = req.body

    const userId = req.user.userId

    const channel = await chatModel.findOne({
        channelName: channelName
    })

    if (userId != channel.admin) {
        return res.status(403).json({
            message: "only admin can delete the channel"
        })
    }

    await chatModel.findOneAndDelete({
        channelName: channelName
    })

    res.status(200).json({
        message: "channel deleted"
    })
})

//add members
chatApp.put('/add-members', verifyToken, async (req, res) => {

    const { channelName, members } = req.body

    const adminId = req.user.userId

    if (!members || members.lenght === 0) {
        return res.status(400).json({
            message: "atleast one members should be added"
        })
    }

    const validMembers = members.filter(id =>
        Types.ObjectId.isValid(id)
    );

    if (validMembers.length !== members.length) {
        return res.status(400).json({
            message: "Invalid member IDs present"
        });
    }

    const channel = await chatModel.findOne({
        channelName: channelName
    })

    if (!channel) {
        return res.status(404).json({
            message: "channel not found"
        })
    }

    if (channel.type === "dm") {
        return res.status(400).json({
            message: "cannot add members to dm"
        })
    }

    if (channel.admin != adminId) {
        return res.status(403).json({
            message: "only admin can add members"
        })
    }

    const updatedChannel =
        await chatModel.findOneAndUpdate(
            {
                channelName: channelName,
            },
            {
                $addToSet: {
                    members: {
                        $each: members
                    }
                }
            },
            { new: true }
        )

    res.status(200).json({
        message: "members added successfully",
        payload: updatedChannel
    })
})

//delete members
chatApp.delete('/delete-members', verifyToken, async (req, res) => {

    const { channelName, member } = req.body

    const userId = req.user.userId

    if (member.length === 0) {
        return res.status(400).json({
            message: "userIds are required"
        })
    }

    const channel = await chatModel.findOne({
        channelName
    })

    if (!channel) {
        return res.status(400).json({
            message: "channel not found"
        })
    }

    if (channel.type === "dm") {
        return res.status(400).json({
            messgae: "cannot delete members from dm"
        })
    }

    if (channel.admin.toString() != userId.toString()) {
        return res.status(403).json({
            messgae: "you are not an admin"
        })
    }

    if (member === userId) {
        return res.status(400).json({
            message: "admin cannot be removed"
        })
    }

    const isMember = channel.members
        .map(id => id.toString())
        .includes(member);

    if (!isMember) {
        return res.status(400).json({
            message: "User not in channel"
        });
    }

    const updatedChannel =
        await chatModel.findOneAndUpdate(
            { channelName },
            {
                $pull: {
                    members: member
                }
            },
            { new: true }
        )

    res.status(200).json({
        messgae: "user removed",
        payload: updatedChannel
    })
})

//get members
chatApp.get('/members', verifyToken, async (req, res) => {

    const { channelName } = req.body

    const channel = await chatModel
        .findOne({ channelName })
        .populate(
            "members",
            "username email"
        )

    if (!channel) {
        return res.status(400).json({
            message: "channel not found"
        })
    }

    if (channel.type === "dm") {
        return res.status(400).json({
            message: "it is a dm chat"
        })
    }

    res.status(200).json({
        message: "members",
        payload: channel.members
    })
})

//JOIN REQUEST
chatApp.post(
    '/chats/join-request',
    verifyToken,
    async (req, res) => {

        try {

            const userId = req.user.userId;

            const { channelId } = req.body;

            if (!channelId) {
                return res.status(400).json({
                    message: 'channelId is required'
                });
            }

            const channel =
                await chatModel.findOne({
                    _id: channelId,
                    type: 'channel'
                });

            if (!channel) {
                return res.status(404).json({
                    message: 'channel not found'
                });
            }

            const alreadyMember =
                channel.members.some(
                    member =>
                        member.toString() ===
                        userId.toString()
                );

            if (alreadyMember) {
                return res.status(400).json({
                    message:
                        'already a member of this channel'
                });
            }

            const existingRequest =
                channel.joinRequests?.some(
                    request =>
                        request.user.toString() ===
                        userId.toString()
                );

            if (existingRequest) {
                return res.status(400).json({
                    message:
                        'join request already pending'
                });
            }

            channel.joinRequests.push({
                user: userId
            });

            await channel.save();

            res.status(200).json({
                message:
                    'join request sent successfully'
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({
                message:
                    'server error creating join request'
            });
        }
    }
)

//APPROVE OR REJECT REQUEST
chatApp.post(
    '/chats/approve-request',
    verifyToken,
    async (req, res) => {

        try {

            const adminId = req.user.userId;

            const {
                channelId,
                userId,
                approve
            } = req.body;

            if (!channelId || !userId) {
                return res.status(400).json({
                    message:
                        'channelId and userId are required'
                });
            }

            const channel =
                await chatModel.findOne({
                    _id: channelId,
                    type: 'channel'
                });

            if (!channel) {
                return res.status(404).json({
                    message:
                        'channel not found'
                });
            }

            if (
                channel.admin.toString() !==
                adminId.toString()
            ) {
                return res.status(403).json({
                    message:
                        'only admin can approve requests'
                });
            }

            const requestIndex =
                channel.joinRequests.findIndex(
                    request =>
                        request.user.toString() ===
                        userId.toString()
                );

            if (requestIndex === -1) {
                return res.status(400).json({
                    message:
                        'no pending request found'
                });
            }

            // REMOVE REQUEST
            channel.joinRequests.splice(
                requestIndex,
                1
            );

            // APPROVE
            if (approve) {

                const alreadyMember =
                    channel.members.some(
                        member =>
                            member.toString() ===
                            userId.toString()
                    );

                if (!alreadyMember) {
                    channel.members.push(userId);
                }
            }

            await channel.save();

            res.status(200).json({
                message: approve
                    ? "request approved"
                    : "request rejected",
                payload: channel
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({
                message:
                    'server error processing request'
            });
        }
    }
)

//leave channel
chatApp.post('/chats/leave', verifyToken, async (req, res) => {

    try {

        const userId = req.user.userId;

        const { channelId } = req.body;

        if (!channelId) {
            return res.status(400).json({
                message: 'channelId is required'
            });
        }

        const channel = await chatModel.findOne({
            _id: channelId,
            type: 'channel'
        });

        if (!channel) {
            return res.status(404).json({
                message: 'channel not found'
            });
        }

        if (
            !channel.members?.some(
                member =>
                    member.toString() ===
                    userId.toString()
            )
        ) {
            return res.status(400).json({
                message:
                    'not a member of this channel'
            });
        }

        if (
            channel.admin.toString() ===
            userId.toString()
        ) {
            return res.status(400).json({
                message:
                    'channel admin cannot leave the channel'
            });
        }

        channel.members =
            channel.members.filter(
                member =>
                    member.toString() !==
                    userId.toString()
            );

        await channel.save();

        res.status(200).json({
            message:
                'left channel successfully'
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message:
                'server error leaving channel'
        });
    }
})
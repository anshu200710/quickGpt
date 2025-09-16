import Chat from "../models/chat.js";
import User from "../models/user.js";
import openai from "../config/openai.js";
import axios from 'axios'
import imagekit from "../config/imageKit.js";


//Test based Ai Chat Generator
export const textMessageController = async( req, res) => {
    try {
        const userId = req.user._id;

        // check Credits
        if (req.user.credits < 1) {
            res.json({success: false, message: "You don't have enough credits to use this features."})
        }

        const {chatId, prompt} = req.body 

        const chat = await Chat.findOne({userId, _id: chatId})
        chat.messages.push({role: 'user', content: prompt, timestamp: Date.now(), isImage: false})

        const {choices} = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
        {
            role: "user",
            content: prompt,
        },
    ],
});

const reply = {...choices[0].message, timestamp: Date.now(), isImage:false}
res.json({success: true, reply})
chat.messages.push(reply)
await chat.save()

await User.updateOne({_id: userId}, {$inc: {credits: -1 }})


    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


//Image Genaratoe based Ai Chat Generator
export const imageMessageController = async( req, res) => {
    try {
        const userId = req.user._id;

        // check Credits
        if (req.user.credits < 2) {
            res.json({success: false, message: "You don't have enough credits to use this features."})
        }


        const {chatId, prompt, isPublished} = req.body;

        // find chat
        const chat = await Chat.findOne({userId, _id: chatId})

        // push user messages
        chat.messages.push({
            role: 'user',
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        })
        //encoded the prompt
        const encodedPrompt = encodeURIComponent(prompt)

        //Construct imageKit Ai generation URL
    const generateImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickChatgpt/${Date.now()}.png?tr=w-800,h-800`

    // Trigger generation by fetching from ImageKit
    const aiImageResponse = await axios.get(generateImageUrl, {responseType: 'arraybuffer'})


    //convert image base64
    const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`;


    // upload to imagekit media library
    const uploadResponse = await imagekit.upload({
        file: base64Image,
        fileName: `${Date.now()}.png`,
        folder: "quickgpt"
    })

    const reply = { 
        role: 'assistant',
        content: uploadResponse.url,
        timestamp: Date.now(),
        isImage: true,
        isPublished
    }

      res.json({success: true, reply})

      chat.messages.push(reply)
      await chat.save()

      await User.updateOne({_id: userId}, {$inc: {credits: -2 }})


    } catch (error) {
        res.json({success: false, message: error.message})

    }
}



// API TO GET Published Images
export const getPublishedImages = async (req, res) => {
    try {
        const publishedImageMessages = await Chat.aggregate([
            {$unwind: "$messages"},
            {
                $match: {
                    "messages.isImage": true,
                    "messages.ispublished": true
                }
            },
            {
                $project: {
                    _id: 0,
                    imageUrl: '$messages.content',
                    userName: '$userName'
                }
            }
        ])

        res.json({success: true, images: publishedImageMessages.reverse()})
    } catch (error) {
         res.json({success: false, message: error.message})
    }
}

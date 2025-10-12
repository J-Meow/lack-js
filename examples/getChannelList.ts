import { SlackClient } from "../index.js"
import "dotenv/config"

const client = new SlackClient({
    xoxc: process.env.SLACK_XOXC,
    xoxd: process.env.SLACK_XOXD,
})

client.userBoot().then(() => {
    console.log(client.channels)
})

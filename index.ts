export class SlackClient {
    xoxc: string | undefined
    xoxd: string | undefined
    subdomain: string | undefined
    userId: string | undefined
    fullName: string | undefined
    displayName: string | undefined
    constructor(options: {
        xoxc?: string | undefined
        xoxd?: string | undefined
        subdomain?: string | undefined
    }) {
        if (options.xoxc && options.xoxd) {
            this.xoxc = options.xoxc
            this.xoxd = options.xoxd
        }
        if (options.subdomain) {
            this.subdomain = options.subdomain
        }
    }
    async userBoot() {
        const response = await (
            await fetch(
                `https://${this.subdomain}.slack.com/api/client.userBoot`,
                {
                    method: "POST",
                    headers: {
                        cookie: `d=${encodeURIComponent(this.xoxd!)}`,
                        "Content-Type":
                            "multipart/form-data; boundary=----boundary",
                    },
                    body: `------boundary
Content-Disposition: form-data; name="token"

${this.xoxc!}
------boundary
Content-Disposition: form-data; name="version_all_channels"

true
------boundary--
`,
                },
            )
        ).json()
        if (response.ok) {
            this.userId = response.self.id
            this.displayName = response.self.profile.display_name
            this.fullName = response.self.profile.real_name
        } else {
            throw new Error("Slack no likey us")
        }
    }
}

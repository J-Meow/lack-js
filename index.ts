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
    async apiPost(route: string, data: FormData | { [index: string]: any }) {
        let formData: FormData
        if (data instanceof FormData) {
            formData = data
        } else {
            formData = new FormData()
            Object.keys(data).forEach((key) => {
                if (key in data) {
                    formData.set(
                        key,
                        data[key] instanceof Blob
                            ? data[key]
                            : String(data[key]),
                    )
                }
            })
        }
        formData.set("token", this.xoxc!)
        const response = await fetch(
            `https://${this.subdomain!}.slack.com/api/${route}`,
            {
                method: "POST",
                body: formData,
                headers: {
                    cookie: "d=" + encodeURIComponent(this.xoxd!),
                },
            },
        )
        const json = await response.json()
        if (!json.ok) {
            throw new Error("Slack error: " + json.error)
        }
        return json
    }
    async userBoot() {
        const response = await this.apiPost("client.userBoot", {
            version_all_channels: true,
        })
        this.userId = response.self.id
        this.displayName = response.self.profile.display_name
        this.fullName = response.self.profile.real_name
    }
}

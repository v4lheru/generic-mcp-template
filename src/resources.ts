
export const RESOURCES = {
    "system-info": {
        uri: "system://info",
        mimeType: "application/json",
        name: "System Information",
        description: "Basic system information",
        handler: async () => {
            return {
                contents: [
                    {
                        uri: "system://info",
                        mimeType: "application/json",
                        text: JSON.stringify(
                            {
                                platform: process.platform,
                                nodeVersion: process.version,
                                uptime: process.uptime(),
                            },
                            null,
                            2
                        ),
                    },
                ],
            };
        },
    },
    "app-config": {
        uri: "config://app",
        mimeType: "application/json",
        name: "Application Configuration",
        description: "Current application configuration",
        handler: async () => {
            return {
                contents: [
                    {
                        uri: "config://app",
                        mimeType: "application/json",
                        text: JSON.stringify(
                            {
                                env: process.env.NODE_ENV || "development",
                                port: process.env.PORT || 3000,
                            },
                            null,
                            2
                        ),
                    },
                ],
            };
        },
    },
};

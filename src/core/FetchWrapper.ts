export class FetchError extends Error {
    response: Response;
    status: number;
    statusText: string;
    body: string | null;

    constructor(message: string, response: Response, body: string | null) {
        super(message);
        this.name = "FetchError";
        this.response = response;
        this.status = response.status;
        this.statusText = response.statusText;
        this.body = body;
    }
}

export class FetchWrapper {

    static async get<T>(url: string, options?: RequestInit): Promise<T> {
        return this.request<T>("GET", url, undefined, options);
    }

    static async post<T>(url: string, body: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>("POST", url, body, options);
    }

    static async put<T>(url: string, body: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>("PUT", url, body, options);
    }

    static async patch<T>(url: string, body?: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>("PATCH", url, body, options);
    }

    static async delete<T>(url: string, options?: RequestInit): Promise<T> {
        return this.request<T>("DELETE", url, undefined, options);
    }

    private static async request<T>(
        method: string,
        url: string,
        body?: unknown,
        options?: RequestInit
    ): Promise<T> {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...options?.headers,
        };

        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            ...options,
        });

        if (!response.ok) {
            const errorText = await this.safeParseError(response);
            throw new FetchError(`${response.status} ${response.statusText}`, response, errorText);
        }

        return this.parseResponse<T>(response);
    }


    private static async parseResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get("Content-Type") || "";

        if (contentType.includes("application/json")) {
            return response.json();
        } else {
            return await response.text() as unknown as T;
        }
    }

    private static async safeParseError(response: Response): Promise<string | null> {
        try {
            return await response.text();
        } catch {
            return null;
        }
    }
}

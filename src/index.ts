import express, { Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import fetch from "node-fetch";

const app = express();

// CORS middleware to allow cross-origin requests
app.use(cors());

// Endpoint to fetch and stream images
app.get('/stream-image', async (req: Request, res: Response) => {
    const encodedUrl = req.query.url as string;

    if (!encodedUrl) {
        return res.status(400).json({ error: 'URL query parameter is required' });
    }

    try {
        const imageUrl = decodeURIComponent(encodedUrl);
        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);

        // Check if response.body is not null before calling pipe
        if (response.body) {
            response.body.pipe(res);
        } else {
            res.status(500).json({ error: 'Failed to get image data' });
        }
    } catch (error) {
        // Type assertion to handle error as an instance of Error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(errorMessage);
        res.status(500).json({ error: errorMessage });
    }
});

app.listen(config.app.port, () => {
    console.log(`Image Proxy Service is running on http://${config.app.host}:${config.app.port}`);
});

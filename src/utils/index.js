// utils.js

export async function fetchJsonData(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${path}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching JSON data:`, error);
        return null;
    }
}

export async function getVideoCards() {
    const videos = await fetchJsonData('/data/railCards.json');

    if (videos && Array.isArray(videos)) {
        return videos.map(video => {
            if (video.url && video.url.endsWith('.m3u8')) {
                return {
                    ...video,
                    isHls: true // Mark video as HLS if it is an m3u8 stream
                };
            } else {
                return {
                    ...video,
                    isHls: false // Mark video as non-HLS otherwise
                };
            }
        });
    }

    return videos;
}

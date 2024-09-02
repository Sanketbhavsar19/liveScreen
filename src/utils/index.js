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
    return videos;
}
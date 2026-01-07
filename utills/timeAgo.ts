
  export const timeAgo = (timestamp: string | any) => {
    // Handle ISO string format: "2026-01-07T09:48:35.287798"
    // Convert to Nepal Time (UTC+5:45)
    
    let date: Date;
    if (typeof timestamp === "string") {
      // If no timezone info, treat as UTC by appending 'Z'
      const isoString = timestamp.includes("Z") || timestamp.includes("+") 
        ? timestamp 
        : timestamp + "Z";
      date = new Date(isoString);
    } else if (timestamp?.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date();
    }

    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
    
    // After 7 days, show date in Nepal timezone
    return date.toLocaleDateString("en-NP", {
      timeZone: "Asia/Kathmandu",
      month: "short",
      day: "numeric",
    });
  };
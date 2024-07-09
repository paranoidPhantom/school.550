export default (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const result = [];
    if (weeks > 0) {
        const unit = weeks > 1 ? (weeks > 4 ? "недель" : "недели") : "неделю";
        result.push(`${weeks} ${unit}`);
    }
    if (days > 0) {
        const unit = days > 1 ? (days > 4 ? "дней" : "дня") : "день";
        result.push(`${days} ${unit}`);
    }
    if (hours > 0) {
        const unit = hours > 1 ? (hours > 4 ? "часов" : "часа") : "час";
        result.push(`${hours} ${unit}`);
    }
    if (minutes > 0) {
        const unit =
            minutes > 1 ? (minutes > 4 ? "минут" : "минуты") : "минуту";
        result.push(`${minutes} ${unit}`);
    }
    return result[0];
};

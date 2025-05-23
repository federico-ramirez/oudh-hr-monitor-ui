class MyDate {
    dates: Date[];
    constructor() {
        this.dates = [];
    }

    private addDays(currentDate: any) {
        let date = new Date(currentDate);
        date.setDate(date.getDate() + 1);
        return date;
    }

    getDates(startDate: Date, endDate: Date) {
        let currentDate: Date = new Date(startDate);
        while (currentDate <= endDate) {
            this.dates.push(currentDate);
            currentDate = this.addDays(currentDate);
        }

        return this.dates;
    }
}

export default MyDate
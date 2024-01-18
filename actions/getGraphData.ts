import moment from "moment";
import prisma from "@/libs/prismadb";


export default async function getGraphData() {
    try {
        // 7 days ago to today - get start and end dates
        // start moment 6 day ago 00:00:00 --> end moment day 23:59:59
        // omnoh 6 odoriin ehelsen moment 00:00:00
        const startDate = moment().subtract(6, "days").startOf("day");
        const endDate = moment().endOf("day");

        // console.log("startDate", startDate.toISOString());
        // console.log("endDate", endDate.toISOString());

        // query db to get order data grouped by createdDate
        const result = await prisma?.order.groupBy({
            by: ["createdDate"],
            where: {
                createdDate: {
                    gte: startDate.toISOString(),
                    lte: endDate.toISOString(),
                },
                status: "complete",
            },
            _sum: {
                amount: true,
            }
        });

        // initialize an object to aggregate the data by day
        const aggregatedData: { [day: string]: {
            day: string;
            date: string;
            totalAmount: number }
        } = {};

        // loop through each day and aggregate the data
        const currentDate = startDate.clone();

        while (currentDate <= endDate) {
            // Format day as string "Monday Tuesday..."
            const day = currentDate.format("dddd");
            // console.log("Current Day format dddd >>> ", day, currentDate);

            // initialize the aggregated data for the day with the day, date, totalAmount
            aggregatedData[day] = {
                day,
                date: currentDate.format("YYYY-MM-DD"),
                totalAmount: 0,
            };

            // move next day
            currentDate.add(1, "day");
        }

        // Calculate total amount for each day by summing the order amount
        result?.forEach((entry) => {
            const day = moment(entry.createdDate).format("dddd");
            const amount = entry._sum?.amount || 0;
            aggregatedData[day].totalAmount += amount;
        });

        // Convert the aggregatedData object to an array and sort by date
        const formattedData = Object.values(aggregatedData).sort((a, b) => moment(a.date).diff(moment(b.date)));

        return formattedData;
    } catch (error: any) {
        throw new Error(error);
    }
}
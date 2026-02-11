import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

type ChartDataItem = {
    field: string;
    result: number;
};

export default function Admin() {
    const [data, setData] = useState<ChartDataItem[]>([]);
    const chartRef = useRef(null); // Ref to canvas
    const chartInstance = useRef<Chart | null>(null);
    // Fetch data
    function fetchData() {
        fetch("/api/getData")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                console.log("Debug Fetched Data:", data);
            })
            .catch((err) => console.error(err));
    }
    function createChart() {
        console.log("Debug 1 Fetched Data:", data);
        if (!chartRef.current) return;
        // 🔥 WICHTIG: Alten Chart zerstören
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(chartRef.current, {
            type: "polarArea",
            data: {
                labels: data.map(row => row.field),
                datasets: [
                    {
                        label: "Punkte",
                        data: data.map(row => row.result),
                        borderWidth: 1,
                        backgroundColor: [
                            'rgb(254, 240, 138)',
                            'rgb(165, 243, 252)',
                            'rgb(191, 219, 254)',
                            'rgb(167, 243, 208)',
                            'rgb(251, 207, 232)',
                            'rgb(147, 197, 253)',
                            'rgb(254, 215, 170)',
                            'rgb(192, 132, 252)'

                        ]
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        // Cleanup chart on unmount
        return () => {
            if(chartInstance.current){
            chartInstance.current.destroy();
            }
        };
    }
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            createChart();
        }
    }, [data]);


    // Initialize chart after component mounts
    // useEffect(() => {
    //     console.log("Debug 1 Fetched Data:", data);
    //     if (!chartRef.current) return;

    //     chartInstance.current = new Chart(chartRef.current, {
    //         type: "polarArea",
    //         data: {
    //             labels: data.map(row => row.field),
    //             datasets: [
    //                 {
    //                     label: "Punkte",
    //                     data: data.map(row => row.result),
    //                     borderWidth: 1,
    //                     backgroundColor: [
    //                         'rgb(255, 99, 132)',
    //                         'rgb(75, 192, 192)',
    //                         'rgb(255, 205, 86)',
    //                         'rgb(201, 203, 207)',
    //                         'rgb(54, 162, 235)'
    //                     ]
    //       },
    //             ],
    //         },
    //         options: {
    //             scales: {
    //                 y: {
    //                     beginAtZero: true,
    //                 },
    //             },
    //         },
    //     });

    //     // Cleanup chart on unmount
    //     return () => {
    //         chartInstance.current.destroy();
    //     };
    // }, [data]); // optional dependency: redraw if `data` changes

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

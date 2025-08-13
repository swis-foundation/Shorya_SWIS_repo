import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const backendUrl =
    process.env.NODE_ENV === "production"
        ? "https://your-backend-domain.com"
        : "http://localhost:3000";

const RealTimeProgressBar = ({ campaignId, initialRaised, initialGoal }) => {
    const [raisedAmount, setRaisedAmount] = useState(parseFloat(initialRaised));
    const [goalAmount] = useState(parseFloat(initialGoal));

    useEffect(() => {
        const socket = io(backendUrl);

        socket.on("connect", () => {
            console.log("Connected to WebSocket server");
        });

        socket.on("campaign_update", (payload) => {
            if (payload.id === campaignId) {
                setRaisedAmount(parseFloat(payload.raised_amount));
            }
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from WebSocket server");
        });

        return () => {
            socket.disconnect();
        };
    }, [campaignId]);

    const progressPercentage = (raisedAmount / goalAmount) * 100;
    const progressBarWidth = `${Math.min(progressPercentage, 100)}%`;

    return (
        <div>
            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                <div
                    className="bg-lime-500 h-full rounded-full transition-all duration-500"
                    style={{ width: progressBarWidth }}
                ></div>
            </div>
            <p className="text-base text-gray-700 mt-2">
                {Math.round(progressPercentage)}% of ₹{goalAmount.toLocaleString()} Goal
            </p>
        </div>
    );
};

export default RealTimeProgressBar;
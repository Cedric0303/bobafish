import React from "react";
import "./css/portal.css";
import { useActivities } from "../api.js";
import Moment from "react-moment";
import "../Pages/css/animation.css";

export default function PastMeetingPortal(props) {
    const { loading, activitiesData, error } = useActivities(
        props.client.email
    );

    const portalContent = () => {
        if (loading) {
            return (
                <div className="portalContent">
                    <p>Loading...</p>
                </div>
            );
        } else if (error) {
            return (
                <div className="portalContent">
                    <p>Something went wrong: {error.message}</p>
                </div>
            );
        } else {
            var upcomingActs = [];
            activitiesData.activities.forEach((act) => {
                if (act.timeEnd < new Date()) {
                    upcomingActs.push(act); // Most recent meetings first
                }
            });
            if (!upcomingActs.length) {
                return (
                    <div className="portalContent">
                        <p>No past meetings!</p>
                    </div>
                );
            } else {
                return (
                    <div className="portalContent">
                        {/* Meetings sorted by date (newest first) */}
                        {upcomingActs.map((activity) => (
                            <div className="portalRow">
                                <span className="leftAlign">
                                    {activity.type}
                                </span>
                                <Moment
                                    className="rightAlign"
                                    format="hh:mm A ddd Do MMM YY"
                                >
                                    {activity.timeStart}
                                </Moment>
                            </div>
                        ))}
                    </div>
                );
            }
        }
    };
    return (
        <div className="clientPastMeetingPortal">
            <p className="portalHeading">Past Meetings</p>
            {portalContent()}
        </div>
    );
}

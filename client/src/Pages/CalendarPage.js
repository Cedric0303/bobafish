import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar.js";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import ReactLoading from "react-loading";
import "./css/calendar.css";
import "./css/animation.css";
import { useActivities, useClients, useWindowDimensions } from "../api.js";
import { clientsToOptions } from "../Components/CalendarUtilities.js";
import Select from "react-select";

function CalendarPage(props) {
    const { height: winHeight } = useWindowDimensions();

    // make calendar fill remaining height
    useEffect(() => {
        let calendarElement =
            document.getElementsByClassName("calendarElement")[0];
        if (calendarElement) {
            calendarElement.style.height =
                winHeight - calendarElement.offsetTop + "px";
        }
    });

    // Check if a client has been passed through
    const givenClient = () => {
        if (
            props.location.state === null ||
            props.location.state === undefined
        ) {
            return null;
        } else if (props.location.state.client) {
            return props.location.state.client;
        } else {
            return null;
        }
    };

    const selectedClient = givenClient();

    const defaultOption = () => {
        if (selectedClient) {
            return [
                {
                    value: selectedClient,
                    label:
                        selectedClient.firstName +
                        " " +
                        selectedClient.lastName,
                },
            ];
        } else {
            return null;
        }
    };

    const { loading, activitiesData, error } = useActivities();
    const [filterActivities, setFilterActivities] = useState(
        activitiesData.activities
    );
    const { cliLoading, clientsData, cliError } = useClients();

    function handleSelect(selectedOptions) {
        if (!selectedOptions.length) {
            setFilterActivities(activitiesData.activities);
        } else {
            var chosenFilters = selectedOptions.map((o) => o.value.email);
            setFilterActivities(
                activitiesData.activities.filter((act) => {
                    return chosenFilters.includes(act.clientReference);
                })
            );
        }
    }

    // Select clients to filter activities shown on calendar
    const filterClient = () => {
        if (cliLoading) {
            return (
                <div id="calendarFilter">
                    <label>Filter by Client:</label>
                    Loading...
                </div>
            );
        } else if (cliError) {
            return (
                <div id="calendarFilter">
                    <label>Filter by Client:</label>
                    Something went wrong: {error.message}
                </div>
            );
        } else if (clientsData.length) {
            var options = clientsToOptions(clientsData);
            if (options) {
                return (
                    <div id="calendarFilter">
                        <label>Filter by Client:</label>
                        <Select
                            defaultValue={defaultOption()}
                            isMulti
                            isSearchable
                            backspaceRemovesValue
                            className="filterClient"
                            onChange={handleSelect}
                            options={options}
                            maxMenuHeight={480}
                        />
                    </div>
                );
            }
        }
    };

    // Get the list of activities that need to be shown
    const getEvents = () => {
        if (filterActivities) {
            return filterActivities;
        } else {
            return activitiesData.activities;
        }
    };

    const localizer = momentLocalizer(moment);

    // Checks whether agenda view (for upcoming meetings) should be the default
    const fromClient = () => {
        if (
            props.location.state === null ||
            props.location.state === undefined
        ) {
            return "month";
        } else {
            return "agenda";
        }
    };

    const pageMain = () => {
        if (loading || cliLoading) {
            return (
                <div>
                    <div>
                        <ul>Loading...</ul>
                    </div>
                    {loading && (
                        <ReactLoading
                            id="loading-anim"
                            type="spin"
                            color="black"
                            height="2%"
                            width="2%"
                        ></ReactLoading>
                    )}
                </div>
            );
        } else if (error) {
            return (
                <div>
                    <p>Something went wrong: {error.message}</p>
                </div>
            );
        } else {
            return (
                <div>
                    <div className="calendarElement">
                        {filterClient()}
                        <NavLink
                            to={{
                                pathname: "/calendar/schedule-meeting",
                            }}
                            className="calendarAdd"
                        >
                            <span>Schedule a New Meeting</span>
                        </NavLink>
                        <Calendar
                            className="actualCalendar"
                            localizer={localizer}
                            defaultView={fromClient()}
                            events={getEvents()}
                            startAccessor="timeStart"
                            endAccessor="timeEnd"
                            titleAccessor="type"
                        />
                    </div>
                </div>
            );
        }
    };

    return (
        <div id="calendar">
            <Navbar />
            <div id="calendarHeader">
                <h2 id="calendarHeading">
                    <span>Calendar</span>
                </h2>
            </div>
            {pageMain()}
        </div>
    );
}

export default CalendarPage;

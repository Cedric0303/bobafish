import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar/Navbar.js";
import { Helmet } from "react-helmet";
import { getStages } from "../api.js";
import Stage from "../Components/Stage.js";
import "./css/adminManageStages.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

function AdminManageStages(props) {
    const modalStyle = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
        },
    };

    Modal.setAppElement(document.getElementById("root") || undefined);

    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    // const { loading, stagesData, error } = useStages();
    const [loading, setLoading] = useState(true);
    const [stagesData, setStages] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        getStages()
            .then((stagesData) => {
                setStages(stagesData.stages);
                setStages(prevStages => updateCurrentPositions(prevStages));
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setError(e);
                setLoading(false);
            });
    }, []);

    const [searchQuery, setSearchQuery] = useState("");

    let disableDragging = false;

    // accepts array of stage objects only
    // returns array of filtered stage objects
    function filterStages(stages, query) {
        if (!query) {
            disableDragging = false;
            return stages;
        } else {
            disableDragging = true;
            var pattern = query
                .split("")
                .map((x) => {
                    return `(?=.*${x})`;
                })
                .join("");
            var regex = new RegExp(`^${pattern}`, "i");
            return stages.filter((stage) => {
                return regex.test(stage.name) || regex.test(stage.position + 1);
            });
        }
    }

    const filteredStages = filterStages(stagesData, searchQuery);

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [moved] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, moved);
        return result;
    };

    const updateCurrentPositions = input => {
        const updatedList = input.map((current, index) => {
            const currentStage = current;
            currentStage.newPos = index;
            if (currentStage.position !== index) {
                currentStage.movedPos = true;
            } else {
                currentStage.movedPos = false;
            }
            return currentStage;
        })
        return updatedList;
    }



    function handleOnDragEnd(result) {
        if (!result.destination) {
            return;
        }

        // update stagesData with new order of stages
        const newStageOrder = reorder(
            stagesData,
            result.source.index,
            result.destination.index
        );
        setStages(updateCurrentPositions(newStageOrder));
    }
    console.log(stagesData);

    const pageMain = () => {
        if (loading) {
            return (
                <div className="stagesBox">
                    <ul>Loading...</ul>
                </div>
            );
        } else if (error) {
            return (
                <div className="stagesBox">
                    <ul>Something went wrong: {error.message}</ul>
                </div>
            );
        } else {
            return (
                <div className="stagesBox">
                    <ul id="stagesList">
                        <li id="stagesListActionBar">
                            <input
                                id="stageSearchBar"
                                value={searchQuery}
                                onInput={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search stages"
                            />
                            <button id="addStageButton" onClick={openModal}>
                                <span>Add New Stage </span>
                                <FontAwesomeIcon icon="plus" />
                            </button>
                        </li>
                        <li id="stagesListHeading">Stage</li>
                        <div id="stageContainer">
                            <div id="stagePosColumn">
                                {stagesData.map((e, index)=>{
                                    if (disableDragging === false) {
                                        if (e.movedPos === true) {
                                            return <div key={index} className="stagePos posChanged">
                                                {index+1}
                                            </div>
                                        } else {
                                            return <div key={index} className="stagePos">
                                                {index+1}
                                            </div>
                                        }
                                    } else {
                                        return false;
                                    }
                                })}
                            </div>
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Droppable droppableId="stagesDroppable">
                                    {(provided) => (
                                        <div
                                            id="stages"
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {filteredStages.map((stage, index) => (
                                                <Stage
                                                    key={stage._id}
                                                    {...stage}
                                                    index={index}
                                                    disableDragging={
                                                        disableDragging
                                                    }
                                                />
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    </ul>
                </div>
            );
        }
    };

    return (
        <div className="manageStages pageContainer">
            <Helmet>
                <style type="text/css">{`
                    html {
                        background-color: #596e80;
                    }
                `}</style>
            </Helmet>
            <Navbar />
            <main className="manageStagesBox">
                <h2 id="stagesHeading">Manage Stages</h2>
                {pageMain()}
            </main>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={modalStyle}
                contentLabel="Add New Stage"
            >
                <h2>Hello</h2>
                <button onClick={closeModal}>close</button>
                <div>this is a modal!</div>
                <form>
                    <input />
                    <button>test</button>
                </form>
            </Modal>
        </div>
    );
}

export default AdminManageStages;

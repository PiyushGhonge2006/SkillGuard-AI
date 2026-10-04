import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createTrainingCentre } from "../services/centreService";

const AddTrainingCentre = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        centreCode: "",
        location: "",
        trainerName: "",
        expectedStudents: "",
    });

    const [equipment, setEquipment] = useState([
        {
            name: "",
            quantity: 1,
        },
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleEquipmentChange = (
        index,
        field,
        value
    ) => {
        setEquipment((previous) =>
            previous.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                        ...item,
                        [field]:
                            field === "quantity"
                                ? Number(value)
                                : value,
                    }
                    : item
            )
        );

        setError("");
        setSuccess("");
    };

    const addEquipment = () => {
        setEquipment((previous) => [
            ...previous,
            {
                name: "",
                quantity: 1,
            },
        ]);
    };

    const removeEquipment = (index) => {
        setEquipment((previous) =>
            previous.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        // Basic validation
        if (
            !formData.name.trim() ||
            !formData.centreCode.trim() ||
            !formData.location.trim() ||
            !formData.trainerName.trim() ||
            !formData.expectedStudents
        ) {
            setError(
                "Please fill in all required fields."
            );
            return;
        }

        const cleanedEquipment =
            equipment
                .filter(
                    (item) =>
                        item.name.trim() !== ""
                )
                .map((item) => ({
                    name: item.name.trim(),
                    quantity:
                        Number(item.quantity) || 1,
                }));

        try {
            setLoading(true);

            await createTrainingCentre({
                ...formData,
                expectedStudents:
                    Number(
                        formData.expectedStudents
                    ),
                requiredEquipment:
                    cleanedEquipment,
            });

            setSuccess(
                "Training centre created successfully."
            );

            // Give the success message a moment
            // before navigating.
            setTimeout(() => {
                navigate("/training-centres");
            }, 800);

        } catch (error) {
            console.error(
                "Create centre error:",
                error
            );

            const message =
                error?.response?.data?.message ||
                "Unable to create training centre. Please try again.";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">

            {/* PAGE HEADER */}
            <div className="page-header">
                <div>
                    <h2>
                        Add Training Centre
                    </h2>

                    <p>
                        Register a new centre for
                        AI-based monitoring
                    </p>
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <div className="error-panel">
                    <h3>
                        Unable to save centre
                    </h3>

                    <p>{error}</p>
                </div>
            )}

            {/* SUCCESS */}
            {success && (
                <div className="success-panel">
                    <h3>
                        Centre Created
                    </h3>

                    <p>{success}</p>
                </div>
            )}

            <form
                className="form-panel"
                onSubmit={handleSubmit}
            >

                {/* BASIC INFORMATION */}
                <div className="form-section">

                    <div className="form-section-header">
                        <h3>
                            Centre Information
                        </h3>

                        <p>
                            Enter the basic details
                            of the training centre.
                        </p>
                    </div>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>
                                Centre Name *
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. SkillGuard Training Centre"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Centre Code *
                            </label>

                            <input
                                type="text"
                                name="centreCode"
                                value={
                                    formData.centreCode
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. SGC001"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Location *
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={
                                    formData.location
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Nagpur, Maharashtra"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Trainer Name *
                            </label>

                            <input
                                type="text"
                                name="trainerName"
                                value={
                                    formData.trainerName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Rahul Sharma"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Expected Students *
                            </label>

                            <input
                                type="number"
                                name="expectedStudents"
                                value={
                                    formData.expectedStudents
                                }
                                onChange={
                                    handleChange
                                }
                                min="1"
                                placeholder="e.g. 30"
                            />
                        </div>

                    </div>
                </div>

                {/* EQUIPMENT */}
                <div className="form-section">

                    <div className="form-section-header">
                        <div>
                            <h3>
                                Required Equipment
                            </h3>

                            <p>
                                Define the equipment
                                expected at this centre.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={addEquipment}
                        >
                            + Add Equipment
                        </button>
                    </div>

                    <div className="equipment-form-list">

                        {equipment.map(
                            (item, index) => (
                                <div
                                    className="equipment-form-row"
                                    key={index}
                                >

                                    <div className="form-group">
                                        <label>
                                            Equipment
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                item.name
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleEquipmentChange(
                                                    index,
                                                    "name",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="e.g. Computer"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Quantity
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            value={
                                                item.quantity
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleEquipmentChange(
                                                    index,
                                                    "quantity",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />
                                    </div>

                                    {equipment.length >
                                        1 && (
                                            <button
                                                type="button"
                                                className="danger-btn"
                                                onClick={() =>
                                                    removeEquipment(
                                                        index
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>
                                        )}

                                </div>
                            )
                        )}

                    </div>
                </div>

                {/* FORM ACTIONS */}
                <div className="form-actions">

                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={() =>
                            navigate(
                                "/training-centres"
                            )
                        }
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create Training Centre"}
                    </button>

                </div>

            </form>
        </div>
    );
};

export default AddTrainingCentre;
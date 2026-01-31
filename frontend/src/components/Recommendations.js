import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./productCard";

const Recommendations = ({ userId }) => {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(`/api/recommendations/${userId}`);
                setRecommendations(response.data);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };
        fetchRecommendations();
    }, [userId]);

    return (
        <div>
            <h2>Recommended for You</h2>
            <div className="recommendations-container">
  {recommendations.map((product) => (
    <ProductCard key={product._id} product={product} />
  ))}
</div>

        </div>
    );
};

export default Recommendations;

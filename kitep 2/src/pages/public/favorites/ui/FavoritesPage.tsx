import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const FavoritesPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/collection?tab=favorites", { replace: true });
  }, [navigate]);

  return null;
};
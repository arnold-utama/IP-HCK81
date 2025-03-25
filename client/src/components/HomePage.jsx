import { useEffect, useState } from "react";
import { api } from "../helpers/http-client";
import RecipeRow from "./RecipeRow";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const { data } = await api.get(`/recipes`, {
          params: {
            q: search,
            regionId: selectedRegion,
          },
        });
        setRecipes(data.recipes);
      } catch (error) {
        console.log("🚀 ~ fetchRecipes ~ error:", error);
      }
    }
    fetchRecipes();
  }, [search, selectedRegion]);

  useEffect(() => {
    async function fetchRegions() {
      try {
        const { data } = await api.get("/regions");
        setRegions(data);
      } catch (error) {
        console.log("🚀 ~ fetchRegions ~ error:", error);
      }
    }
    fetchRegions();
  }, []);

  return (
    <div className="py-4 flex-grow-1">
      <div className="text-center">
        <h1>Recipe List</h1>
      </div>
      <div className="container mt-4">
        <div className="row g-3 mb-4">
          <div className="col-9">
            <input
              className="form-control"
              type="search"
              placeholder="Search menu"
              aria-label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-3">
            <select
              className="form-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="col-1">#</th>
              <th className="col-auto">Name</th>
              <th className="col-1">Region</th>
              <th className="col-3"></th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe, index) => (
              <RecipeRow key={recipe.id} recipe={recipe} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

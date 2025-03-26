import { useEffect, useState } from "react";
import RecipeRow from "./RecipeRow";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyRecipes, deleteRecipe } from "../features/myrecipes/myRecipeSlice";
import { fetchRegions } from "../features/regions/regionSlice";
import { Link } from "react-router";

export default function MyRecipesPage() {
  const dispatch = useDispatch();
  const myRecipes = useSelector((state) => state.myRecipe.list.data);
  const regions = useSelector((state) => state.region.list);
  const totalPages = useSelector((state) => state.myRecipe.list.totalPages);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const isEditable = true;

  useEffect(() => {
    dispatch(fetchMyRecipes({ search, selectedRegion, currentPage }));
  }, [search, selectedRegion, currentPage]);

  useEffect(() => {
    dispatch(fetchRegions());
  }, []);

  return (
    <div className="py-4 flex-grow-1">
      <div className="text-center">
        <h1>My Recipes</h1>
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
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="col-3">
            <select
              className="form-select"
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setCurrentPage(1);
              }}
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
        <div className="mb-4">
          <Link to="/recipes/add" className="btn btn-primary">
            Add Recipe
          </Link>
        </div>
        <InfiniteScroll
          dataLength={myRecipes.length}
          scrollThreshold={1}
          next={() => {
            setTimeout(() => {
              setCurrentPage((prev) => prev + 1);
            }, 500);
          }}
          hasMore={currentPage < totalPages}
          loader={
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "3rem" }}
            >
              <div
                className="spinner-border"
                role="status"
                style={{ height: "1.5rem", width: "1.5rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          }
          endMessage={
            <p className="text-center">
              <b>{myRecipes.length ? "" : "No data"}</b>
            </p>
          }
        >
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
              {myRecipes.map((recipe, index) => (
                <RecipeRow
                  key={recipe.id}
                  recipe={recipe}
                  index={index}
                  isEditable={isEditable}
                  handleDelete={(id) => dispatch(deleteRecipe(id))}
                />
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
}

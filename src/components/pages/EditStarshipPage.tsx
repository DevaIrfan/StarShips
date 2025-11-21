import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Upload, X, Plus, Trash2, Save } from "lucide-react";
import { starshipsApi } from "../../services/starshipsApi";

export default function EditStarshipPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    faction: "Rebel Alliance" as
      | "Rebel Alliance"
      | "Galactic Empire"
      | "Galactic Republic"
      | "CIS",
    corporation: "",
    shipClass: "",
    image: "",
    shieldPoints: 0,
    hullPoints: 0,
    armaments: [""],
    description: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  // Load data starship (prefill)
  useEffect(() => {
    const loadStarship = async () => {
      if (!id) return;

      const data = await starshipsApi.getStarshipById(id);
      if (!data) {
        alert("Starship not found!");
        navigate("/");
        return;
      }

      setFormData({
        name: data.name ?? "",
        faction: data.faction as any,
        corporation: data.corporation ?? "",
        shipClass: data.shipClass ?? "",
        image: data.image ?? "",
        shieldPoints: data.shieldPoints ?? 0,
        hullPoints: data.hullPoints ?? 0,
        armaments: data.armaments ? data.armaments.split(",") : [""],
        description: data.description ?? "",
      });

      setImagePreview(data.image ?? "");
      setLoadingData(false);
    };

    loadStarship();
  }, [id, navigate]);

  // On submit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredArmaments = formData.armaments.filter((a) => a.trim() !== "");
    if (filteredArmaments.length === 0) {
      alert("Please add at least one armament");
      return;
    }

    setLoading(true);
    try {
      await starshipsApi.updateStarship(id!, {
        ...formData,
        armaments: filteredArmaments.join(","),
      });

      navigate("/");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update starship");
    } finally {
      setLoading(false);
    }
  };

  // Input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "shieldPoints" || name === "hullPoints"
          ? parseInt(value) || 0
          : value,
    }));
  };

  // Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setFormData((prev) => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  // Armament controls
  const addArmament = () => {
    setFormData((prev) => ({
      ...prev,
      armaments: [...prev.armaments, ""],
    }));
  };

  const removeArmament = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      armaments: prev.armaments.filter((_, i) => i !== index),
    }));
  };

  const updateArmament = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      armaments: prev.armaments.map((a, i) => (i === index ? value : a)),
    }));
  };

  if (loadingData) {
    return (
      <div className="text-center py-20 text-gray-400 text-xl">
        Loading starship data...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl mb-6">Edit Starship</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Starship Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg"
              />
            </div>

            {/* Faction */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Faction *
              </label>
              <select
                name="faction"
                value={formData.faction}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg"
              >
                <option value="Rebel Alliance">Rebel Alliance</option>
                <option value="Galactic Empire">Galactic Empire</option>
                <option value="Galactic Republic">Galactic Republic</option>
                <option value="CIS">CIS</option>
              </select>
            </div>

            {/* Corporation */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Corporation *
              </label>
              <input
                type="text"
                name="corporation"
                value={formData.corporation}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg"
              />
            </div>

            {/* Ship Class */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Ship Class *
              </label>
              <input
                type="text"
                name="shipClass"
                value={formData.shipClass}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Starship Image *
              </label>

              {!imagePreview ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-gray-900 hover:border-blue-500"
                  >
                    <Upload size={48} className="text-gray-500 mb-3" />
                    <p className="text-gray-400 mb-1">Click to upload image</p>
                    <p className="text-gray-500 text-sm">
                      PNG, JPG, WEBP (Max 5MB)
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Shield & Hull */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Shield Points *
                </label>
                <input
                  type="number"
                  name="shieldPoints"
                  min="0"
                  value={formData.shieldPoints}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Hull Points *
                </label>
                <input
                  type="number"
                  name="hullPoints"
                  min="0"
                  value={formData.hullPoints}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg"
                />
              </div>
            </div>

            {/* Armaments */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Armaments *
              </label>

              <div className="space-y-2">
                {formData.armaments.map((arm, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={arm}
                      onChange={(e) =>
                        updateArmament(index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg"
                      placeholder="Laser Cannons"
                    />

                    {formData.armaments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArmament(index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addArmament}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                >
                  <Plus size={16} />
                  Add Armament
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg resize-none"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, Upload, Trash2 } from 'lucide-react';
import { starshipsApi } from '../../services/starshipsApi';

export default function AddStarshipPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    faction: 'Rebel Alliance' as 'Rebel Alliance' | 'Galactic Empire' | 'Galactic Republic' | 'CIS',
    corporation: '',
    shipClass: '',
    image: '',
    shieldPoints: 0,
    hullPoints: 0,
    armaments: [''],
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty armaments
    const filteredArmaments = formData.armaments.filter(a => a.trim() !== '');
    
    if (filteredArmaments.length === 0) {
      alert('Please add at least one armament');
      return;
    }

    if (!formData.image) {
      alert('Please upload an image');
      return;
    }

    setLoading(true);
    try {
      await starshipsApi.addStarship({
        ...formData,
        armaments: filteredArmaments.join(",")
      });
      navigate('/');
    } catch (error) {
      console.error('Error adding starship:', error);
      alert('Failed to add starship');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'shieldPoints' || name === 'hullPoints' ? parseInt(value) || 0 : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, image: base64String }));
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview('');
  };

  const addArmament = () => {
    setFormData(prev => ({
      ...prev,
      armaments: [...prev.armaments, '']
    }));
  };

  const removeArmament = (index: number) => {
    setFormData(prev => ({
      ...prev,
      armaments: prev.armaments.filter((_, i) => i !== index)
    }));
  };

  const updateArmament = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      armaments: prev.armaments.map((a, i) => i === index ? value : a)
    }));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl mb-6">Add New Starship</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Starship Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g., X-Wing Starfighter"
              />
            </div>

            {/* Faction */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Faction *</label>
              <select
                name="faction"
                required
                value={formData.faction}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="Rebel Alliance">Rebel Alliance</option>
                <option value="Galactic Empire">Galactic Empire</option>
                <option value="Galactic Republic">Galactic Republic</option>
                <option value="CIS">CIS</option>
              </select>
            </div>

            {/* Corporation */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Corporation *</label>
              <input
                type="text"
                name="corporation"
                required
                value={formData.corporation}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g., Incom Corporation"
              />
            </div>

            {/* Ship Class */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Ship Class *</label>
              <input
                type="text"
                name="shipClass"
                required
                value={formData.shipClass}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g., Starfighter, Capital Ship, Bomber"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Starship Image *</label>
              
              {!imagePreview ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-900"
                  >
                    <Upload size={48} className="text-gray-500 mb-3" />
                    <p className="text-gray-400 mb-1">Click to upload image</p>
                    <p className="text-gray-500 text-sm">PNG, JPG, WEBP (Max 5MB)</p>
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
                    className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Shield & Hull Points */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Shield Points *</label>
                <input
                  type="number"
                  name="shieldPoints"
                  required
                  min="0"
                  value={formData.shieldPoints}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Hull Points *</label>
                <input
                  type="number"
                  name="hullPoints"
                  required
                  min="0"
                  value={formData.hullPoints}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Armaments */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Armaments *</label>
              <div className="space-y-2">
                {formData.armaments.map((armament, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={armament}
                      onChange={(e) => updateArmament(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="e.g., Laser Cannons"
                    />
                    {formData.armaments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArmament(index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addArmament}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Plus size={16} />
                  Add Armament
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Description *</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Enter a description of the starship..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Add Starship
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
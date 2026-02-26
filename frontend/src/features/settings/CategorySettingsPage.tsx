import React, { useState } from "react";
import { Plus, Trash2, Edit2, Check, X, ArrowLeft } from "lucide-react";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useConfirmStore } from "../../store/useConfirmStore";
import {
  TextField,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const CategorySettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories, addCategory, removeCategory, updateCategory } =
    useCategoryStore();
  const { openConfirm } = useConfirmStore();
  const [newCat, setNewCat] = useState("");
  const [newCatColor, setNewCatColor] = useState("#3B82F6");
  const [newCatType, setNewCatType] = useState<"normal" | "credit">("normal");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editType, setEditType] = useState<"normal" | "credit">("normal");

  const handleAdd = () => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    if (
      categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      toast.error("Category already exists.");
      return;
    }
    addCategory({ name: trimmed, color: newCatColor, type: newCatType });
    setNewCat("");
    setNewCatColor("#3B82F6");
    setNewCatType("normal");
    toast.success("Category added.");
  };

  const handleDelete = (id: string, catName: string) => {
    openConfirm({
      title: "Delete Category",
      message: `Are you sure you want to delete the "${catName}" category?`,
      onConfirm: () => {
        removeCategory(id);
        toast.success("Category deleted.");
      },
    });
  };

  const handleStartEdit = (
    id: string,
    catName: string,
    catColor: string,
    catType: "normal" | "credit" = "normal",
  ) => {
    setEditingCatId(id);
    setEditValue(catName);
    setEditColor(catColor);
    setEditType(catType);
  };

  const handleSaveEdit = () => {
    if (!editingCatId) return;
    const trimmed = editValue.trim();
    if (!trimmed) {
      setEditingCatId(null);
      return;
    }
    if (
      categories.some(
        (c) =>
          c.id !== editingCatId &&
          c.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      toast.error("This category name already exists.");
      return;
    }
    updateCategory(editingCatId, {
      name: trimmed,
      color: editColor,
      type: editType,
    });
    setEditingCatId(null);
    toast.success("Category updated.");
  };

  const handleCancelEdit = () => {
    setEditingCatId(null);
    setEditValue("");
    setEditColor("");
    setEditType("normal");
  };

  return (
    <div className="space-y-6 h-full flex flex-col pt-2">
      <div className="flex items-center gap-4">
        <IconButton
          onClick={() => navigate("/settings")}
          size="small"
          className="text-gray-500 hover:bg-gray-100">
          <ArrowLeft size={20} />
        </IconButton>
        <div>
          <h2 className="text-2xl font-bold text-secondary-main">Categories</h2>
          <p className="text-gray-500 text-sm">
            Add, edit, or delete categories used for your transactions.
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
        <TextField
          label="New Category"
          variant="outlined"
          size="small"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          sx={{ maxWidth: 300 }}
          fullWidth
        />
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Color:</label>
          <input
            type="color"
            value={newCatColor}
            onChange={(e) => setNewCatColor(e.target.value)}
            className="w-10 h-10 p-0 border-0 rounded-lg cursor-pointer bg-transparent"
          />
        </div>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={newCatType}
            onChange={(e) =>
              setNewCatType(e.target.value as "normal" | "credit")
            }>
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="credit">Credit</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!newCat.trim()}
          startIcon={<Plus size={18} />}
          className="!rounded-lg !py-2 !px-4">
          Add
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col gap-3 bg-white px-5 py-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ backgroundColor: cat.color }}
              />
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-semibold text-gray-800 text-lg">
                    {cat.name}
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${cat.type === "credit" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}>
                    {cat.type}
                  </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleStartEdit(cat.id, cat.name, cat.color, cat.type)
                    }
                    className="text-gray-400 hover:text-primary-main hover:bg-blue-50 transition-colors">
                    <Edit2 size={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-400">
              No categories found. Add one above!
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={!!editingCatId}
        onClose={handleCancelEdit}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", overflow: "visible" },
        }}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <DialogTitle className="!p-0 !text-xl !font-bold">
            Edit Category
          </DialogTitle>
          <IconButton onClick={handleCancelEdit} size="small">
            <X size={20} />
          </IconButton>
        </div>

        <DialogContent className="space-y-6 !p-6 flex flex-col gap-4">
          <TextField
            label="Category Name"
            size="small"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveEdit();
              if (e.key === "Escape") handleCancelEdit();
            }}
            fullWidth
            className="!mt-2"
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Color:
              </label>
              <input
                type="color"
                value={editColor}
                onChange={(e) => setEditColor(e.target.value)}
                className="w-10 h-10 p-0 border-0 rounded-lg cursor-pointer bg-transparent"
              />
            </div>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={editType}
                onChange={(e) =>
                  setEditType(e.target.value as "normal" | "credit")
                }>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="credit">Credit</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <Button onClick={handleCancelEdit} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            color="primary"
            className="!rounded-xl">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

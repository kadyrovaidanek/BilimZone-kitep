import heart1 from "@/assets/images/heart1.svg";
import heart2 from "@/assets/images/heart2.svg";

import { useFavorites } from "@/entities/favorite/model/useFavorites";
import type { Book } from "../model/types";

export const BookCard = ({ book }: { book: Book }) => {
  const { toggleFavorite, isFavorite } = useFavorites();

  const active = isFavorite(book.id);

  return (
    <div className="bg-[#EAF1F8] p-4 rounded-xl shadow flex gap-4 relative">

      {/* ❤️ HEART */}
      <button
        onClick={() => toggleFavorite(book.id)}
        className="absolute top-3 right-3"
      >
        <img
          src={active ? heart2 : heart1}
          alt="favorite"
          className="w-6 h-6 transition"
        />
      </button>

      {/* 📘 КНИГА */}
      <img
        src={book.image}
        className="w-20 h-28 object-cover rounded"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-[#1E3A5F]">
          {book.title}
        </h3>

        <p className="text-orange-500 text-sm">
          {book.author}
        </p>

        <p className="text-sm text-slate-600 mt-2">
          {book.description}
        </p>
      </div>

    </div>
  );
};
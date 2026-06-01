import { useState, useEffect } from "react";

const KEY = "publications";

export type PublicationItem = {
  id: number;
  title: string;
  description: string;
  category?: string;
  subject?: string;
  grade?: string;
  type?: string;
  priceType: "free" | "paid";
  price: number;
  file?: File | null;
  contractAccepted?: boolean;
  createdAt?: string;
};

export const usePublications = () => {
  const [publications, setPublications] = useState<PublicationItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        setPublications(JSON.parse(saved) as PublicationItem[]);
      }
    } catch (error) {
      console.error("Ошибка при чтении из localStorage:", error);
    }
  }, []);

  const save = (data: PublicationItem[]) => {
    setPublications(data);
    localStorage.setItem(KEY, JSON.stringify(data));
  };

  const addPublication = (pub: PublicationItem) => {
    const updated = [pub, ...publications];
    save(updated);
  };

  const updatePublication = (updated: PublicationItem) => {
    const newData = publications.map((p) => (p.id === updated.id ? updated : p));
    save(newData);
  };

  const deletePublication = (id: number) => {
    const newData = publications.filter((p) => p.id !== id);
    save(newData);
  };

  return {
    publications,
    addPublication,
    updatePublication,
    deletePublication,
  };
};
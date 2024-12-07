import React, { createContext, useState, useContext } from "react";
import { Pet } from "../types";

type PetContextType = {
  pets: Pet[];
  addPet: (pet: Pet) => void;
  updatePet: (pet: Pet) => void;
  deletePet: (id: string) => void;
  searchPets: (query: string) => void;
};

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pets, setPets] = useState<Pet[]>([]);

  const addPet = (pet: Pet) => {
    const isDuplicated = pets.some((petItem) => petItem.name.toLowerCase() === pet.name.toLowerCase());

    if (isDuplicated) {
      return;
    }
    setPets((pets) => [...pets, pet]);
  };

  const updatePet = (updatedPet: Pet) => {
    const newPets = pets.map((pet) => {
      if (pet.id === updatedPet.id) {
        return updatedPet;
      }
      return pet;
    });
    setPets(newPets);
  };

  const deletePet = (id: string) => {
    setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
  };

  const searchPets = (keyword: string) => {
    if (!keyword) return;
    return pets.filter((pet) =>
        pet.name.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  return (
    <PetContext.Provider
      value={{ pets, addPet, updatePet, deletePet, searchPets }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePetContext = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePetContext must be used within a PetProvider");
  }
  return context;
};

import React, { useMemo, useState} from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { usePetContext } from "../context/PetContext";
import { Pet } from "../types";
import { launchImageLibrary } from "react-native-image-picker";

const MainScreen: React.FC = () => {
  const { addPet, updatePet, deletePet, pets } = usePetContext();
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>('');
  const [description, setDescription] = useState("");
  const [editingPet, setEditingPet] = useState<Pet | undefined>(undefined);
  const [filterAge, setFilterAge] = useState<string>('');
  const [filterDescription, setFilterDescription] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [image, setPhotoUrl] = useState<string>('');

  const handleSubmit = () => {
    // Emptiness validation
    if (!name.trim() || !age.trim()) {
      return;
    }

    // Age validation
    if (isNaN(Number(age)) || Number(age) <= 0) {
      return;
    }

    const petData: Pet = {
      id: editingPet?.id || Date.now().toString(),
      name,
      age,
      description,
      image
    };

    if (editingPet) {
      updatePet(petData);
    } else {
      addPet(petData);
    }
  };

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.5 }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else {
        setPhotoUrl(response.assets?.[0].uri);
      }
    });
  };


  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      // keep filtered items by name
      const matchesName = pet.name.toLowerCase().includes(searchKeyword.toLowerCase());

      // filter by age
      const matchesAge =
          filterAge === '' || pet.age === filterAge;

      // filter by description
      const matchesDescription = pet.description?.toLowerCase()
          .includes(filterDescription.toLowerCase());

      // Return pet if it matches all filter criteria
      return matchesName && matchesAge && matchesDescription;
    });
  }, [pets, searchKeyword, filterAge, filterDescription]);

  const renderPetItem = ({ item }: { item: any }) => (
    <View style={styles.petItem}>
      <Text>Name: {item.name}</Text>
      <Text>Age: {item.age}</Text>
      {item.description && <Text>Description: {item.description}</Text>}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            setEditingPet(item);
            setName(item.name);
            setAge(item.age);
            setDescription(item.description || "");
          }}
          style={styles.editButton}
        >
          <Text>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deletePet(item.id)}
          style={styles.deleteButton}
        >
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
            style={styles.input}
            value={searchKeyword}
            onChangeText={setSearchKeyword}
            placeholder="Search"
        />
      </View>

      <View style={styles.filterContainer}>
        <Text>Filter by Age: (only numbers allowed)</Text>
        <TextInput
            style={styles.input}
            value={filterAge}
            keyboardType="numeric"
            onChangeText={setFilterAge}
            placeholder="Filter by age"
        />

        <Text>Filter by Description:</Text>
        <TextInput
            style={styles.input}
            value={filterDescription}
            onChangeText={setFilterDescription}
            placeholder="Filter by description"
        />
      </View>

      <View style={styles.formContainer}>
        <TouchableOpacity onPress={handleChoosePhoto} style={styles.picker}>
          <Text style={styles.buttonText}>Photo Picker</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Pet Name"
        />
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Pet Age"
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Pet Description"
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {editingPet ? "Update Pet" : "Add Pet"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={filteredPets}
          keyExtractor={(item) => item.id}
          renderItem={renderPetItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
  },
  inputContainer: {
    padding: 16
  },
  filterContainer: {
    padding: 16
  },
  formContainer: {
    padding: 16,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  picker: {
    backgroundColor: "blue",
    width: 100,
    padding: 16,
    borderRadius: 5,
    marginBottom: 20
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  petItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  editButton: {
    backgroundColor: "#2196F3",
    padding: 8,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 5,
  },
});

export default MainScreen;

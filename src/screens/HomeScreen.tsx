import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button } from "react-native";
import { fetchItems } from "../services/api";
import ListItem from "../components/ListItem";
import { clearAll } from "../storage/asyncStorage";

export default function HomeScreen({ navigation }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleLogout() {
    await clearAll();
    navigation.replace("Login");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList data={items} keyExtractor={(i) => String(i.id ?? i._id ?? Math.random())} renderItem={({ item }) => <ListItem item={item} />} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#f0f0f0" },
  title: { fontSize: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }
});

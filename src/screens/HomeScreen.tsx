import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button } from "react-native";
import ListItem from "../components/ListItem";
import { clearAuthSession } from "../storage/asyncStorage";

export default function HomeScreen({ navigation }: any) {
  const [items] = useState<any[]>([]);

  async function handleLogout() {
    await clearAuthSession();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
      <Text style={styles.subtitle}>Bem-vindo.</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id ?? i._id ?? Math.random())}
        renderItem={({ item }) => <ListItem item={item} />}
        ListEmptyComponent={<Text style={styles.empty}>Sem dados para exibir.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#f0f0f0" },
  title: { fontSize: 20 },
  subtitle: { marginBottom: 12 },
  empty: { opacity: 0.7 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ListItem({ item }: { item: any }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title ?? item.name ?? "No title"}</Text>
      <Text style={styles.subtitle}>{item.subtitle ?? item.description ?? ""}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderRadius: 8, backgroundColor: "#fff", marginBottom: 8, borderWidth: 1, borderColor: "#eee" },
  title: { fontSize: 16, fontWeight: "600" },
  subtitle: { color: "#666", marginTop: 4 }
});

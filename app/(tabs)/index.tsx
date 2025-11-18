import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const STORAGE_KEY = "@protracker_tasks";

type TaskStatus = "Pendente" | "Em andamento" | "Concluída";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

type FilterType = "ALL" | TaskStatus;

const STATUS: Record<"PENDING" | "IN_PROGRESS" | "DONE", TaskStatus> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluída",
};

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState<FilterType>("ALL");

  // Carregar tarefas salvas
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setTasks(JSON.parse(stored) as Task[]);
        }
      } catch (error) {
        console.log("Erro ao carregar tarefas:", error);
      }
    };
    loadTasks();
  }, []);

  // Salvar tarefas sempre que mudarem
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.log("Erro ao salvar tarefas:", error);
      }
    };
    saveTasks();
  }, [tasks]);

  const handleAddTask = () => {
    if (!newTitle.trim()) {
      Alert.alert("Atenção", "Digite um título para a tarefa.");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      status: STATUS.PENDING,
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTitle("");
  };

  const updateTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
    );
  };

  const deleteTask = (id: string) => {
    Alert.alert("Confirmar", "Tem certeza que deseja excluir esta tarefa?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          setTasks((prev) => prev.filter((task) => task.id !== id));
        },
      },
    ]);
  };

  const getFilteredTasks = (): Task[] => {
    if (filter === "ALL") return tasks;
    return tasks.filter((task) => task.status === filter);
  };

  const total = tasks.length;
  const totalDone = tasks.filter((t) => t.status === STATUS.DONE).length;
  const totalInProgress = tasks.filter((t) => t.status === STATUS.IN_PROGRESS).length;
  const totalPending = tasks.filter((t) => t.status === STATUS.PENDING).length;
  const percentDone = total > 0 ? Math.round((totalDone / total) * 100) : 0;

  const renderTask: ListRenderItem<Task> = ({ item }) => (
    <View style={styles.taskCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskStatusLabel}>Status: {item.status}</Text>
      </View>

      <View style={styles.taskButtons}>
        {item.status !== STATUS.PENDING && (
          <TouchableOpacity
            style={[styles.statusButton, styles.btnPending]}
            onPress={() => updateTaskStatus(item.id, STATUS.PENDING)}
          >
            <Text style={styles.statusButtonText}>P</Text>
          </TouchableOpacity>
        )}

        {item.status !== STATUS.IN_PROGRESS && (
          <TouchableOpacity
            style={[styles.statusButton, styles.btnInProgress]}
            onPress={() => updateTaskStatus(item.id, STATUS.IN_PROGRESS)}
          >
            <Text style={styles.statusButtonText}>A</Text>
          </TouchableOpacity>
        )}

        {item.status !== STATUS.DONE && (
          <TouchableOpacity
            style={[styles.statusButton, styles.btnDone]}
            onPress={() => updateTaskStatus(item.id, STATUS.DONE)}
          >
            <Text style={styles.statusButtonText}>C</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.statusButton, styles.btnDelete]}
          onPress={() => deleteTask(item.id)}
        >
          <Text style={styles.statusButtonText}>X</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.appTitle}>ProTracker – DataWork Pessoal</Text>
      <Text style={styles.appSubtitle}>
        Registre suas tarefas e acompanhe sua performance diária.
      </Text>

      {/* Dashboard */}
      <View style={styles.dashboard}>
        <View style={styles.dashboardRow}>
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardLabel}>Total</Text>
            <Text style={styles.dashboardValue}>{total}</Text>
          </View>
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardLabel}>Concluídas</Text>
            <Text style={styles.dashboardValue}>{totalDone}</Text>
          </View>
        </View>

        <View style={styles.dashboardRow}>
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardLabel}>Em andamento</Text>
            <Text style={styles.dashboardValue}>{totalInProgress}</Text>
          </View>
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardLabel}>Pendentes</Text>
            <Text style={styles.dashboardValue}>{totalPending}</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <Text style={styles.dashboardLabel}>
            % Concluídas: {percentDone}%
          </Text>
          <View style={styles.progressBarBackground}>
            <View
              style={[styles.progressBarFill, { width: `${percentDone}%` }]}
            />
          </View>
        </View>
      </View>

      {/* Input nova tarefa */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Descreva uma nova tarefa..."
          placeholderTextColor="#6b7280"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <FilterButton
          label="Todas"
          selected={filter === "ALL"}
          onPress={() => setFilter("ALL")}
        />
        <FilterButton
          label="Pendente"
          selected={filter === STATUS.PENDING}
          onPress={() => setFilter(STATUS.PENDING)}
        />
        <FilterButton
          label="Em andamento"
          selected={filter === STATUS.IN_PROGRESS}
          onPress={() => setFilter(STATUS.IN_PROGRESS)}
        />
        <FilterButton
          label="Concluída"
          selected={filter === STATUS.DONE}
          onPress={() => setFilter(STATUS.DONE)}
        />
      </View>

      {/* Lista de tarefas */}
      <FlatList
        data={getFilteredTasks()}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhuma tarefa cadastrada ainda. Comece adicionando uma acima. :)
          </Text>
        }
      />
    </SafeAreaView>
  );
}

interface FilterButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function FilterButton({ label, selected, onPress }: FilterButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.filterButton, selected && styles.filterButtonSelected]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterButtonText,
          selected && styles.filterButtonTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e5e7eb",
  },
  appSubtitle: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 12,
  },
  dashboard: {
    backgroundColor: "#020617",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  dashboardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dashboardCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  dashboardLabel: {
    fontSize: 11,
    color: "#9ca3af",
  },
  dashboardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e5e7eb",
  },
  progressBarContainer: {
    marginTop: 6,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#1f2937",
    borderRadius: 999,
    marginTop: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#22c55e",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#020617",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#e5e7eb",
    borderWidth: 1,
    borderColor: "#1f2937",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addButtonText: {
    color: "#e5e7eb",
    fontWeight: "bold",
    fontSize: 13,
  },
  filtersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  filterButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4b5563",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  filterButtonSelected: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  filterButtonText: {
    fontSize: 12,
    color: "#e5e7eb",
  },
  filterButtonTextSelected: {
    fontWeight: "bold",
  },
  taskCard: {
    flexDirection: "row",
    backgroundColor: "#020617",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  taskTitle: {
    color: "#e5e7eb",
    fontSize: 14,
    fontWeight: "600",
  },
  taskStatusLabel: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 4,
  },
  taskButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 8,
  },
  statusButton: {
    width: 26,
    height: 26,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  statusButtonText: {
    fontSize: 12,
    color: "#020617",
    fontWeight: "bold",
  },
  btnPending: {
    backgroundColor: "#f97316",
  },
  btnInProgress: {
    backgroundColor: "#eab308",
  },
  btnDone: {
    backgroundColor: "#22c55e",
  },
  btnDelete: {
    backgroundColor: "#ef4444",
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 16,
    fontSize: 13,
  },
});

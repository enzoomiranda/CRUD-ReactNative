import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator,
  Modal 
} from 'react-native';
import { useBebidasDatabase, Bebida } from './src/useBebidasDatabase';

export default function App() {
  const { bebidas, addBebida, updateBebida, deleteBebida, isReady } = useBebidasDatabase();
  
  // Estados separados para Criação e Edição
  const [nomeNovaBebida, setNomeNovaBebida] = useState('');
  const [nomeEdicao, setNomeEdicao] = useState('');
  const [bebidaSendoEditada, setBebidaSendoEditada] = useState<Bebida | null>(null);

  // Função para Adicionar
  const handleAdd = async () => {
    if (!nomeNovaBebida.trim()) return;
    await addBebida(nomeNovaBebida);
    setNomeNovaBebida('');
  };

  // Função para abrir o Modal de Edição
  const abrirEdicao = (item: Bebida) => {
    setBebidaSendoEditada(item);
    setNomeEdicao(item.nome);
  };

  // Função para salvar a Edição e fechar o Modal
  const salvarEdicao = async () => {
    if (bebidaSendoEditada && nomeEdicao.trim()) {
      await updateBebida(bebidaSendoEditada.id, nomeEdicao);
      setBebidaSendoEditada(null);
      setNomeEdicao('');
    }
  };

  if (!isReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.header}>🍹 Gestão de Bebidas</Text>
      
      {/* Input de Cadastro sempre visível */}
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Nova bebida..."
          value={nomeNovaBebida}
          onChangeText={setNomeNovaBebida}
        />
        <TouchableOpacity style={styles.btnAdd} onPress={handleAdd}>
          <Text style={styles.btnTextWhite}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={bebidas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.nome}</Text>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => abrirEdicao(item)} style={styles.btnEdit}>
                <Text style={styles.btnTextWhite}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteBebida(item.id)} style={styles.btnDelete}>
                <Text style={styles.btnTextWhite}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Estoque vazio.</Text>}
      />

      {/* --- MODAL DE EDIÇÃO (A INTERFACE QUE SOBREPÕE) --- */}
      <Modal
        visible={!!bebidaSendoEditada}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setBebidaSendoEditada(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Bebida</Text>
            
            <TextInput
              style={styles.modalInput}
              value={nomeEdicao}
              onChangeText={setNomeEdicao}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.btnCancel} 
                onPress={() => setBebidaSendoEditada(null)}
              >
                <Text style={styles.btnTextCancel}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnSave} onPress={salvarEdicao}>
                <Text style={styles.btnTextWhite}>Salvar Alteração</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', paddingTop: 50, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#1F2937' },
  inputBox: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 15, borderWidth: 1, borderColor: '#E5E7EB' },
  btnAdd: { backgroundColor: '#10B981', justifyContent: 'center', paddingHorizontal: 20, borderRadius: 10 },
  btnTextWhite: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cardText: { fontSize: 16, fontWeight: '500', color: '#374151' },
  row: { flexDirection: 'row', gap: 8 },
  btnEdit: { backgroundColor: '#F59E0B', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnDelete: { backgroundColor: '#EF4444', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
  
  // Estilos do Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', width: '100%', maxWidth: 400, borderRadius: 15, padding: 25, shadowColor: '#000', shadowOpacity: 0.25, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#111827' },
  modalInput: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  btnCancel: { padding: 12 },
  btnTextCancel: { color: '#6B7280', fontWeight: '600' },
  btnSave: { backgroundColor: '#3B82F6', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
});
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const conversasLista = document.getElementById('conversasLista');
    const mensagens = document.getElementById('mensagens');
    const messagemInput = document.getElementById('messagemInput');
    const sendButton = document.getElementById('Button');
    const chatHeader = document.getElementById('Chat');
    const searchInput = document.querySelector('.search-input');
    
    // Estado da aplicação
    let currentContacts = [];
    let selectedContact = null;
    
    // Função para buscar contatos
    const fetchContacts = async (numero) => {
        try {
            showLoading();
            const url = `https://giovanna-whatsapp.onrender.com/v1/whatsapp/contatos/${numero}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            
            const { dados_contato } = await response.json();
            return dados_contato;
        } catch (error) {
            console.error('Erro ao buscar contatos:', error);
            showError('Erro ao buscar contatos. Verifique o número e tente novamente.');
            return [];
        } finally {
            hideLoading();
        }
    };
    
    // Função para buscar conversas
    const fetchConversations = async (numero, contato) => {
        try {
            showLoading();
            const url = `https://giovanna-whatsapp.onrender.com/v1/whatsapp/conversas?numero=${numero}&contato=${encodeURIComponent(contato)}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            
            const { conversas } = await response.json();
            return conversas[0].conversas;
        } catch (error) {
            console.error('Erro ao buscar conversas:', error);
            showError('Erro ao buscar conversas. Tente novamente.');
            return [];
        } finally {
            hideLoading();
        }
    };
    
    // Renderizar lista de contatos
    const renderContacts = (contacts) => {
        conversasLista.textContent = '';
        
        if (contacts.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'Nenhum contato encontrado';
            conversasLista.appendChild(emptyState);
            return;
        }
        
        const fragment = document.createDocumentFragment();
        
        contacts.forEach(contact => {
            const contactItem = document.createElement('div');
            contactItem.className = 'contact-item';
            
            const avatar = document.createElement('img');
            avatar.className = 'contact-avatar';
            avatar.src = contact.profile || 'https://via.placeholder.com/40/ECE5DD/666666?text=PF';
            avatar.alt = contact.name;
            
            const info = document.createElement('div');
            info.className = 'contact-info';
            
            const name = document.createElement('h4');
            name.className = 'contact-name';
            name.textContent = contact.name;
            
            const lastMsg = document.createElement('p');
            lastMsg.className = 'contact-last-msg';
            lastMsg.textContent = contact.lastMessage || 'Sem mensagens recentes';
            
            info.append(name, lastMsg);
            contactItem.append(avatar, info);
            
            contactItem.addEventListener('click', () => {
                selectContact(contact);
            });
            
            fragment.appendChild(contactItem);
        });
        
        conversasLista.appendChild(fragment);
    };
    
    // Selecionar contato e carregar mensagens
    const selectContact = async (contact) => {
        selectedContact = contact;
        chatHeader.textContent = contact.name;
        
        const conversations = await fetchConversations('SEU_NUMERO_AQUI', contact.name);
        renderMessages(conversations);
    };
    
    // Renderizar mensagens
    const renderMessages = (messages) => {
        mensagens.textContent = '';
        
        if (messages.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'Nenhuma mensagem encontrada';
            mensagens.appendChild(emptyState);
            return;
        }
        
        const fragment = document.createDocumentFragment();
        
        messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${message.sender === "me" ? "message-out" : "message-in"}`;
            
            const content = document.createElement('div');
            content.className = 'message-content';
            content.textContent = message.content;
            
            const time = document.createElement('span');
            time.className = 'message-time';
            time.textContent = message.time;
            
            messageDiv.append(content, time);
            fragment.appendChild(messageDiv);
        });
        
        mensagens.appendChild(fragment);
        mensagens.scrollTop = mensagens.scrollHeight;
    };
    
    // Enviar mensagem
    const sendMessage = () => {
        const text = messagemInput.value.trim();
        if (!text || !selectedContact) return;
        
        // Aqui você implementaria o envio para a API
        console.log(`Enviando mensagem para ${selectedContact.name}: ${text}`);
        
        // Adiciona mensagem localmente (simulação)
        const newMessage = {
            content: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: "me"
        };
        
        renderMessages([newMessage]);
        messagemInput.value = '';
    };
    
    // Filtrar contatos
    const filterContacts = (term) => {
        const filtered = currentContacts.filter(contact => 
            contact.name.toLowerCase().includes(term.toLowerCase())
        );
        renderContacts(filtered);
    };
    
    // Funções auxiliares
    const showLoading = () => {
        // Implemente um indicador de carregamento moderno
        console.log('Carregando...');
    };
    
    const hideLoading = () => {
        console.log('Carregamento completo');
    };
    
    const showError = (message) => {
        // Implemente um toast ou modal de erro moderno
        console.error(message);
    };
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    messagemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    searchInput.addEventListener('input', (e) => {
        filterContacts(e.target.value);
    });
    
    // Inicialização
    const init = async () => {
        // Simulando busca inicial de contatos
        currentContacts = await fetchContacts('SEU_NUMERO_AQUI');
        renderContacts(currentContacts);
    };
    
    init();
});
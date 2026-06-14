<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Send, X, MessageCircle } from 'lucide-vue-next';

const phoneNumber = '+2290153413838'; // Numéro spécifié par l'utilisateur
const isChatOpen = ref(false);
const userMessage = ref('');
const showPulseBadge = ref(true);

const presetMessages = [
  { label: '🛍️ Informations produit', text: 'Bonjour ! J\'aimerais avoir plus de détails sur l\'un de vos produits s\'il vous plaît.' },
  { label: '📦 Suivi de commande', text: 'Bonjour ! Je vous contacte pour faire le suivi de ma commande.' },
  { label: '💰 Code Promo / Offres', text: 'Bonjour, y a-t-il des codes promo ou des offres spéciales en cours ?' },
  { label: '📞 Discuter en direct', text: 'Bonjour, j\'aimerais parler en direct à un conseiller.' }
];

const messagesList = ref<{ sender: 'bot' | 'user'; text: string; time: string }[]>([
  {
    sender: 'bot',
    text: 'Bonjour ! 👋 Bienvenue chez Kamie Shop. Je suis votre assistant virtuel.',
    time: formatTime()
  },
  {
    sender: 'bot',
    text: 'Comment puis-je vous aider aujourd\'hui ? Cliquez sur une des questions fréquentes ou tapez votre message personnalisé.',
    time: formatTime()
  }
]);

function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function selectPreset(text: string) {
  // On ajoute le message dans le chat visuel pour une expérience interactive
  messagesList.value.push({ sender: 'user', text, time: formatTime() });
  
  // On simule une réponse de l'assistant avant la redirection
  messagesList.value.push({
    sender: 'bot',
    text: 'Formidable ! Je vous redirige immédiatement vers notre ligne WhatsApp pour finaliser cela.',
    time: formatTime()
  });

  // On redirige vers WhatsApp après un court instant
  setTimeout(() => {
    openWhatsApp(text);
  }, 1000);
}

function sendMessage() {
  if (!userMessage.value.trim()) return;
  const msg = userMessage.value.trim();
  messagesList.value.push({ sender: 'user', text: msg, time: formatTime() });
  userMessage.value = '';

  messagesList.value.push({
    sender: 'bot',
    text: 'Entendu. Redirection en cours sur WhatsApp pour échanger directement...',
    time: formatTime()
  });

  setTimeout(() => {
    openWhatsApp(msg);
  }, 1000);
}

function openWhatsApp(text: string) {
  // S'assurer que le numéro est bien formaté pour l'API WhatsApp
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function toggleChat() {
  isChatOpen.value = !isChatOpen.value;
  if (isChatOpen.value) {
    showPulseBadge.value = false; // Efface la notification dès que l'utilisateur ouvre
  }
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 font-sans">
    
    <!-- BOUTON FLOTTANT WHATSAPP -->
    <button
      id="whatsapp-float-btn"
      @click="toggleChat"
      class="w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 relative cursor-pointer"
      title="Discuter sur WhatsApp"
    >
      <!-- Logo WhatsApp personnalisé de haute qualité -->
      <svg
        v-if="!isChatOpen"
        class="w-7 h-7 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <X v-else class="w-6 h-6 transition-transform rotate-0" />

      <!-- Notification Badge clignotante -->
      <span
        v-if="showPulseBadge && !isChatOpen"
        class="absolute -top-1 -right-1 flex h-4 w-4"
      >
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold text-white items-center justify-center leading-none">
          1
        </span>
      </span>
    </button>

    <!-- FENÊTRE DE DISCUSSION DU CHATBOT -->
    <transition name="chat-slide">
      <div
        v-if="isChatOpen"
        class="absolute bottom-18 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col z-50 max-h-[500px]"
      >
        
        <!-- En-tête vert Whatsapp -->
        <div class="bg-[#075E54] text-white p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm tracking-wide text-white">
                KS
              </div>
              <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#075E54] rounded-full"></span>
            </div>
            <div class="text-left">
              <h4 class="font-sans font-bold text-sm leading-tight text-white">Support Kamie Shop</h4>
              <p class="text-[10px] text-emerald-100 font-medium">Répond généralement instantanément</p>
            </div>
          </div>
          <button
            @click="isChatOpen = false"
            class="text-white/80 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Corps de discussion avec bulles -->
        <div class="flex-1 overflow-y-auto p-4 bg-[#ECE5DD] space-y-3 min-h-[250px] max-h-[320px] scrollbar-none">
          <div
            v-for="(msg, index) in messagesList"
            :key="index"
            :class="[
              'flex flex-col max-w-[85%] rounded-2xl px-3.5 py-2 text-xs font-sans shadow-xs leading-normal',
              msg.sender === 'bot'
                ? 'bg-white text-slate-800 self-start rounded-tl-none'
                : 'bg-[#DCF8C6] text-slate-800 self-end rounded-tr-none ml-auto'
            ]"
          >
            <p>{{ msg.text }}</p>
            <span class="text-[9px] text-slate-400 self-end mt-1 font-mono">{{ msg.time }}</span>
          </div>

          <!-- Raccourcis ou propositions rapides -->
          <div class="pt-2">
            <p class="text-[10px] text-slate-500 font-semibold mb-2 text-left px-1">Options rapides de discussion :</p>
            <div class="flex flex-wrap gap-1.5 justify-start">
              <button
                v-for="preset in presetMessages"
                :key="preset.label"
                @click="selectPreset(preset.text)"
                class="bg-white/85 hover:bg-indigo-50 border border-slate-200/80 text-slate-700 hover:text-indigo-600 font-sans font-medium hover:border-indigo-200 text-[10px] sm:text-xs py-1.5 px-2.5 rounded-full text-left transition-all max-w-full truncate cursor-pointer shadow-xs"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Formulaire d'envoi personnalisé bas -->
        <div class="p-3 bg-white border-t border-slate-50 flex items-center gap-2">
          <input
            type="text"
            v-model="userMessage"
            @keyup.enter="sendMessage"
            placeholder="Écrivez votre message..."
            class="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-sans text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-[#075E54] focus:bg-white transition-all"
          />
          <button
            @click="sendMessage"
            class="p-2 bg-[#075E54] hover:bg-[#128C7E] text-white rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
            title="Envoyer"
          >
            <Send class="w-4 h-4" />
          </button>
        </div>

      </div>
    </transition>

  </div>
</template>

<style scoped>
/* Animations d'affichage de la boîte de dialogue */
.chat-slide-enter-active, .chat-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.chat-slide-enter-from, .chat-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Scrollbar de discussion discrète */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

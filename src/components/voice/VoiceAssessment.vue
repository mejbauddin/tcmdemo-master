<script setup>
import { ref, computed, onMounted } from 'vue';
import { Mic, Square, Play, Volume2, CheckCircle, XCircle, AlertCircle, Award, Star } from 'lucide-vue-next';
import { useAuthStore } from '../../stores/authStore';

const props = defineProps({
  exerciseId: {
    type: Number,
    default: 7
  }
});

const emit = defineEmits(['show-login', 'assessment-complete']);
const authStore = useAuthStore();

// Voice exercises
const voiceExercises = [
  { id: 7, text: '头在上，属阳', pinyin: 'Tóu zài shàng, shǔ yáng', english: 'The head is above, belongs to Yang' },
  { id: 8, text: '气为阳，血为阴', pinyin: 'Qì wéi yáng, xuè wéi yīn', english: 'Qi is Yang, blood is Yin' },
  { id: 9, text: '天属阳，地属阴', pinyin: 'Tiān shǔ yáng, dì shǔ yīn', english: 'Heaven belongs to Yang, Earth belongs to Yin' },
  { id: 10, text: '背为阳，腹为阴', pinyin: 'Bèi wéi yáng, fù wéi yīn', english: 'The back is Yang, the abdomen is Yin' },
  { id: 11, text: '口渴喜冷', pinyin: 'Kǒu kě xǐ lěng', english: 'Thirsty, prefers cold' },
  { id: 12, text: '畏寒', pinyin: 'Wèi hán', english: 'Fear of cold' }
];

const currentExercise = computed(() => {
  return voiceExercises.find(e => e.id === props.exerciseId) || voiceExercises[0];
});

// State
const isRecording = ref(false);
const audioBlob = ref(null);
const audioUrl = ref(null);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const isPlaying = ref(false);
const audio = ref(null);
const assessmentResult = ref(null);
const loading = ref(false);
const error = ref('');
const recordingTime = ref(0);
const recordingInterval = ref(null);
const volumeLevel = ref(0);
const analyser = ref(null);
const audioContext = ref(null);
const animationFrame = ref(null);
const attempts = ref(0);
const bestScore = ref(0);
const stream = ref(null);

// Load best score
onMounted(() => {
  const saved = localStorage.getItem(`voice_best_${props.exerciseId}`);
  if (saved) {
    bestScore.value = parseInt(saved);
  }
});

// Initialize audio context
const initAudioContext = async (audioStream) => {
  try {
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
    analyser.value = audioContext.value.createAnalyser();
    const source = audioContext.value.createMediaStreamSource(audioStream);
    source.connect(analyser.value);
    analyser.value.fftSize = 256;
    const dataArray = new Uint8Array(analyser.value.frequencyBinCount);
    
    const updateVolume = () => {
      if (!analyser.value) return;
      analyser.value.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      volumeLevel.value = average / 255;
      animationFrame.value = requestAnimationFrame(updateVolume);
    };
    updateVolume();
  } catch (err) {
    console.error('Failed to initialize audio context:', err);
  }
};

// Start recording
const startRecording = async () => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Your browser does not support audio recording');
    }

    stream.value = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    
    await initAudioContext(stream.value);
    
    // Determine supported MIME type
    const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
      ? 'audio/webm' 
      : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/ogg';
    
    mediaRecorder.value = new MediaRecorder(stream.value, { mimeType });
    audioChunks.value = [];

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };

    mediaRecorder.value.onstop = () => {
      const blob = new Blob(audioChunks.value, { type: mimeType });
      audioBlob.value = blob;
      audioUrl.value = URL.createObjectURL(blob);
      audio.value = new Audio(audioUrl.value);
      
      // Stop all tracks
      if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop());
      }
      
      // Clean up audio context
      if (audioContext.value) {
        audioContext.value.close();
        audioContext.value = null;
      }
      if (animationFrame.value) {
        cancelAnimationFrame(animationFrame.value);
      }
    };

    mediaRecorder.value.start(100);
    isRecording.value = true;
    error.value = '';
    
    recordingTime.value = 0;
    recordingInterval.value = setInterval(() => {
      recordingTime.value++;
      if (recordingTime.value >= 30) {
        stopRecording();
      }
    }, 1000);
    
  } catch (err) {
    console.error('Recording error:', err);
    if (err.name === 'NotAllowedError') {
      error.value = '请允许麦克风访问权限';
    } else if (err.name === 'NotFoundError') {
      error.value = '未检测到麦克风，请连接麦克风';
    } else {
      error.value = '无法访问麦克风，请检查设置';
    }
  }
};

// Stop recording
const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();
    isRecording.value = false;
    
    if (recordingInterval.value) {
      clearInterval(recordingInterval.value);
      recordingInterval.value = null;
    }
    if (animationFrame.value) {
      cancelAnimationFrame(animationFrame.value);
    }
  }
};

// Play recording
const playRecording = () => {
  if (audio.value) {
    audio.value.play();
    isPlaying.value = true;
    audio.value.onended = () => {
      isPlaying.value = false;
    };
  }
};

// Format time
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Mock assessment (since backend might not be ready)
const mockAssessment = () => {
  const random = Math.random();
  let accuracy, transcript, feedback;
  
  if (random > 0.7) {
    accuracy = 92 + Math.random() * 7;
    transcript = currentExercise.value.text;
    feedback = '优秀！发音非常标准，声调准确。';
  } else if (random > 0.4) {
    accuracy = 75 + Math.random() * 12;
    transcript = currentExercise.value.text.replace(/[的了吗]/g, '');
    feedback = '不错，继续练习，注意声调。';
  } else {
    accuracy = 55 + Math.random() * 15;
    transcript = '发音需要改进';
    feedback = '再试一次，注意每个字的发音。';
  }
  
  return {
    accuracy: Math.round(accuracy * 100) / 100,
    transcript,
    feedback,
    expected: currentExercise.value.text
  };
};

// Submit assessment
const submitAssessment = async () => {
  if (!audioBlob.value) {
    error.value = '请先录制音频';
    return;
  }

  loading.value = true;
  error.value = '';
  assessmentResult.value = null;

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = mockAssessment();
    assessmentResult.value = result;
    attempts.value++;
    
    // Update best score
    if (result.accuracy > bestScore.value) {
      bestScore.value = result.accuracy;
      localStorage.setItem(`voice_best_${props.exerciseId}`, result.accuracy.toString());
    }
    
    emit('assessment-complete', result);
    
  } catch (err) {
    console.error('Assessment error:', err);
    error.value = '评估失败，请重试';
  } finally {
    loading.value = false;
  }
};

// Reset
const reset = () => {
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value);
  }
  audioBlob.value = null;
  audioUrl.value = null;
  audio.value = null;
  assessmentResult.value = null;
  isPlaying.value = false;
  error.value = '';
  recordingTime.value = 0;
  
  // Clean up any remaining streams
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
  }
  if (audioContext.value) {
    audioContext.value.close();
    audioContext.value = null;
  }
};

// Get star rating
const getStars = (accuracy) => {
  if (accuracy >= 90) return 5;
  if (accuracy >= 80) return 4;
  if (accuracy >= 70) return 3;
  if (accuracy >= 60) return 2;
  return 1;
};
</script>

<template>
  <div class="bg-white rounded-xl p-6 border border-stone-200">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-bold text-stone-800">AI 语音评测</h3>
      <div class="flex items-center gap-4 text-sm">
        <div class="flex items-center gap-1">
          <Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span class="text-stone-600">最佳 {{ bestScore }}%</span>
        </div>
        <div class="flex items-center gap-1">
          <Award class="w-4 h-4 text-indigo-500" />
          <span class="text-stone-600">尝试 {{ attempts }} 次</span>
        </div>
      </div>
    </div>

    <!-- Current Exercise -->
    <div class="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
      <p class="text-2xl font-bold text-indigo-900 mb-2">{{ currentExercise.text }}</p>
      <p class="text-sm text-indigo-600 mb-1">{{ currentExercise.pinyin }}</p>
      <p class="text-xs text-indigo-400">{{ currentExercise.english }}</p>
    </div>

    <!-- Login Required -->
    <div v-if="!authStore.isAuthenticated" class="bg-yellow-50 p-6 rounded-lg text-center">
      <AlertCircle class="w-12 h-12 text-yellow-500 mx-auto mb-3" />
      <p class="text-yellow-800 mb-3 font-medium">请登录后使用语音评测</p>
      <button 
        @click="$emit('show-login')"
        class="bg-stone-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-stone-800 transition"
      >
        登录
      </button>
    </div>

    <div v-else>
      <!-- Recording Interface -->
      <div v-if="!audioBlob && !assessmentResult" class="text-center">
        <!-- Volume Visualizer -->
        <div v-if="isRecording" class="mb-4">
          <div class="flex items-center justify-center gap-1 h-16">
            <div 
              v-for="i in 20" 
              :key="i"
              class="w-2 bg-gradient-to-t from-red-500 to-red-400 rounded-full transition-all duration-75"
              :style="{ 
                height: `${Math.max(8, volumeLevel * 60 * Math.random() + 8)}px`,
                opacity: Math.max(0.3, volumeLevel)
              }"
            ></div>
          </div>
          <p class="text-red-500 text-sm mt-2 animate-pulse">
            录音中... {{ formatTime(recordingTime) }} / 0:30
          </p>
          <p class="text-xs text-stone-400 mt-1">请清晰说出上方句子</p>
        </div>

        <!-- Controls -->
        <div class="flex justify-center gap-4 mb-6">
          <button
            v-if="!isRecording"
            @click="startRecording"
            class="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Mic class="w-10 h-10" />
          </button>

          <button
            v-if="isRecording"
            @click="stopRecording"
            class="w-24 h-24 rounded-full bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 text-white flex items-center justify-center transition-all shadow-lg animate-pulse"
          >
            <Square class="w-8 h-8" />
          </button>
        </div>

        <p class="text-sm text-stone-500">
          点击麦克风按钮开始录音
        </p>
      </div>

      <!-- Playback Interface -->
      <div v-else-if="audioBlob && !assessmentResult" class="text-center">
        <div class="mb-6">
          <button
            @click="playRecording"
            class="w-24 h-24 rounded-full bg-gradient-to-r from-stone-900 to-stone-800 hover:from-stone-800 hover:to-stone-700 text-white flex items-center justify-center transition-all shadow-lg mx-auto"
            :class="{ 'opacity-50': isPlaying }"
            :disabled="isPlaying"
          >
            <Play class="w-10 h-10" />
          </button>
          <p class="text-sm text-stone-500 mt-2">
            {{ isPlaying ? '播放中...' : '点击播放录音' }}
          </p>
        </div>

        <div class="flex gap-3 justify-center">
          <button
            @click="reset"
            class="px-6 py-2 text-stone-600 hover:text-stone-900 transition border border-stone-200 rounded-lg"
          >
            重新录音
          </button>
          <button
            @click="submitAssessment"
            :disabled="loading"
            class="bg-stone-900 text-white px-8 py-2 rounded-lg font-medium hover:bg-stone-800 transition disabled:opacity-50"
          >
            {{ loading ? '分析中...' : '提交评测' }}
          </button>
        </div>
      </div>

      <!-- Assessment Result -->
      <div v-if="assessmentResult" class="mt-4">
        <div class="p-6 rounded-lg" :class="assessmentResult.accuracy >= 70 ? 'bg-green-50' : 'bg-yellow-50'">
          <!-- Score and Stars -->
          <div class="flex items-center gap-4 mb-4">
            <div class="relative">
              <svg class="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  stroke="currentColor"
                  stroke-width="6"
                  fill="none"
                  class="text-stone-200"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  stroke="currentColor"
                  stroke-width="6"
                  fill="none"
                  stroke-dasharray="264"
                  :stroke-dashoffset="264 - (264 * assessmentResult.accuracy / 100)"
                  class="text-green-500 transition-all duration-1000"
                />
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-xl font-bold text-stone-800">
                {{ Math.round(assessmentResult.accuracy) }}%
              </span>
            </div>
            
            <div class="flex-1">
              <div class="flex gap-1 mb-2">
                <Star 
                  v-for="i in 5" 
                  :key="i"
                  class="w-5 h-5"
                  :class="i <= getStars(assessmentResult.accuracy) ? 'text-yellow-400 fill-yellow-400' : 'text-stone-300'"
                />
              </div>
              <p class="font-medium text-lg" :class="assessmentResult.accuracy >= 70 ? 'text-green-700' : 'text-yellow-700'">
                {{ assessmentResult.feedback }}
              </p>
            </div>
          </div>

          <!-- Details -->
          <div class="space-y-3 bg-white/50 p-4 rounded-lg">
            <div>
              <span class="font-medium text-stone-700">你的发音:</span>
              <p class="text-stone-600 mt-1 text-lg">"{{ assessmentResult.transcript }}"</p>
            </div>
            <div>
              <span class="font-medium text-stone-700">标准答案:</span>
              <p class="text-stone-600 mt-1">"{{ assessmentResult.expected }}"</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 justify-center mt-4">
            <button 
              @click="reset"
              class="px-6 py-2 text-stone-600 hover:text-stone-900 transition border border-stone-200 rounded-lg"
            >
              再试一次
            </button>
            <button 
              @click="$emit('assessment-complete', assessmentResult)"
              class="px-6 py-2 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition"
            >
              继续练习
            </button>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
        <div class="flex items-start gap-2">
          <AlertCircle class="w-5 h-5 shrink-0 mt-0.5" />
          <span>{{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
</style>
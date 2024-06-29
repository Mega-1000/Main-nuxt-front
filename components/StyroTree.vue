<template>
  <div class="styrofoam-tree">
    <h2 class="title">Klasyfikacja Styropianu</h2>
    <div class="tree-container">
      <div v-for="(type, index) in styrofoamTypes" :key="index" class="tree-node" :class="{ 'expanded': expandedNodes[index] }">
        <div class="node-header" @click="toggleNode(index)">
          <div class="node-icon" :class="type.icon"></div>
          <h3>{{ type.name }}</h3>
          <span class="expand-icon">{{ expandedNodes[index] ? '−' : '+' }}</span>
        </div>
        <transition name="expand">
          <div v-if="expandedNodes[index]" class="node-content">
            <p>{{ type.description }}</p>
            <div class="subtypes">
              <div v-for="(subtype, subIndex) in type.subtypes" :key="subIndex" class="subtype">
                <h4>{{ subtype.name }}</h4>
                <p>{{ subtype.explanation }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const styrofoamTypes = [
  {
    name: 'Styropian Elewacyjny',
    icon: 'icon-facade',
    description: 'Stosowany do izolacji termicznej ścian zewnętrznych budynków.',
    subtypes: [
      { name: 'Lambda 031', explanation: 'Najwyższa izolacyjność, idealny do domów pasywnych i energooszczędnych.' },
      { name: 'Lambda 033', explanation: 'Bardzo dobra izolacyjność, popularne rozwiązanie w nowoczesnym budownictwie.' },
      { name: 'Lambda 038', explanation: 'Standardowa izolacyjność, ekonomiczne rozwiązanie dla typowych budynków.' }
    ]
  },
  {
    name: 'Styropian Podłogowy',
    icon: 'icon-floor',
    description: 'Używany do izolacji podłóg, stropów i posadzek.',
    subtypes: [
      { name: 'EPS 100', explanation: 'Standardowa wytrzymałość na ściskanie, do typowych zastosowań podłogowych.' },
      { name: 'EPS 200', explanation: 'Zwiększona wytrzymałość, do pomieszczeń o większym obciążeniu użytkowym.' }
    ]
  },
  {
    name: 'Styropian Dachowy',
    icon: 'icon-roof',
    description: 'Przeznaczony do izolacji dachów płaskich i skośnych.',
    subtypes: [
      { name: 'EPS 80', explanation: 'Lekki i wydajny, do standardowych konstrukcji dachowych.' },
      { name: 'EPS 100', explanation: 'Zwiększona wytrzymałość, do dachów z większym obciążeniem lub ruchem pieszym.' }
    ]
  },
  {
    name: 'Styropian Fundamentowy',
    icon: 'icon-foundation',
    description: 'Stosowany do izolacji fundamentów i ścian piwnic.',
    subtypes: [
      { name: 'EPS 100', explanation: 'Standardowa ochrona dla typowych warunków gruntowych.' },
      { name: 'EPS 200', explanation: 'Wzmocniona ochrona dla trudnych warunków gruntowych i większych obciążeń.' }
    ]
  }
];

const expandedNodes = reactive(Array(styrofoamTypes.length).fill(false));

const toggleNode = (index) => {
  expandedNodes[index] = !expandedNodes[index];
};
</script>

<style scoped>
.styrofoam-tree {
  font-family: 'Roboto', sans-serif;
  max-width: 1500px;
  margin: 30px auto;
  padding: 40px 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);

}

.title {
  text-align: center;
  color: #333;
  font-size: 2.5em;
  margin-bottom: 40px;
  font-weight: 300;
}

.tree-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tree-node {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tree-node.expanded {
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.node-header {
  display: flex;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.node-header:hover {
  background-color: #f0f0f0;
}

.node-icon {
  width: 40px;
  height: 40px;
  margin-right: 15px;
  background-color: #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.node-header h3 {
  flex-grow: 1;
  margin: 0;
  font-weight: 500;
  color: #333;
}

.expand-icon {
  font-size: 24px;
  color: #757575;
}

.node-content {
  padding: 0 20px 20px;
}

.node-content p {
  margin-top: 0;
  color: #616161;
  line-height: 1.6;
}

.subtypes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.subtype {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 6px;
}

.subtype h4 {
  margin: 0 0 10px 0;
  color: #424242;
  font-weight: 500;
}

.subtype p {
  margin: 0;
  font-size: 0.9em;
  color: #757575;
}

.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 1000px;
  opacity: 1;
  overflow: hidden;
}

.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Custom icons */
.icon-facade::before { content: '🏢'; }
.icon-floor::before { content: '🔳'; }
.icon-roof::before { content: '🏠'; }
.icon-foundation::before { content: '🏗️'; }
</style>

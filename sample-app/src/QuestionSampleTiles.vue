<template>
  <div class="tiles">
    <v-item-group mandatory>
      <v-container class="pa-0" :class="question.guiOptions && question.guiOptions.compact ? 'compact' : ''">
        <v-row class="tiles-row">
          <v-col
            v-for="(item, itemIndex) in question._choices"
            :key="itemIndex"
            :cols="question.guiOptions && question.guiOptions.compact ? 'auto' : '12'"
            :lg="question.guiOptions && question.guiOptions.compact ? '3' : '4'"
            md="4"
            sm="6"
          >
            <v-item v-slot:default="{ active, toggle }">
              <v-card
                class="d-flex flex-column mx-auto tile-size"
                :class="question.guiOptions && question.guiOptions.compact ? 'compact' : ''"
                @click="onAnswerChanged(item.value)"
                :data-itemvalue="item.value"
                tile
                hover
                flat
                dark
                elevation=2
              >
                <v-card-title>{{item.name}}</v-card-title>
                <v-tooltip bottom max-width="300px">
                  <template v-slot:activator="{ on }">
                    <v-card-text v-on="on" class="description" :class="question.guiOptions && question.guiOptions.compact ? 'compact' : ''">
                      {{item.description}}
                    </v-card-text>
                  </template>
                  <span>{{item.description}}</span>
                </v-tooltip>
                <v-spacer v-if="false"></v-spacer>
                <v-card-text class="homepage">
                  <a :href="item.homepage">More Information</a>
                 </v-card-text>
                <v-card-actions class="tile-image-container">
                  <img :src="item.image" v-if="item.image"/>
                </v-card-actions>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
  </div>
</template>

<script>
export default {
  name: "QuestionTiles",
  watch: {
    "question.answer": {
      handler: function (newValue, oldValue) {
        this.applyStyles(newValue, oldValue);
      }
    }
  },
  methods: {
    applyStyles(newAnswer, oldAnswer) {
      this.toggleSelected(oldAnswer); // deselect old selection
      this.toggleSelected(newAnswer); // select new selection
    },
    toggleSelected(answer) {
      if (answer) {
        const element = document.querySelector(`.v-card[data-itemvalue='${answer}']`);
        if (element) {
          element.classList.toggle("selected");
        }
      }
    },
    onAnswerChanged(value) {
      this.$emit("answerChanged", this.question.name, value);
    }
  },
  props: {
    question: Object
  },
  mounted: function() {
    this.applyStyles(this.question.answer, undefined);
  }
};
</script>

<style scoped>
.v-card.selected {
  border: 1px solid;
}
.v-card {
  border: none;
}
.v-card__title {
  word-wrap: break-word;
  word-break: normal;
}
.description.v-card__text {
  text-overflow: ellipsis;
  overflow: hidden;
}
.description.v-card__text.compact {
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  padding-bottom: 0px;
  padding-top: 0px;
  min-height: calc(1.375rem * 3) 
}
.homepage.v-card__text {
  padding-bottom: 0;
}
a {
  font-size: 11px;
}
.tiles-row {
  margin: 0px;
}
.tile-image-container {
  max-height:40%;
}
.tile-image-container > img {
  object-fit: scale-down;
  width: 100%;
  height: 100%;
}
.tile-size {
  width: 400px;
  height: 380px;
}
.tile-size.compact {
  width: 300px;
  height: 285px;
  margin: 0px !important;
}
.v-container.compact {
  margin-right: 0;
  margin-left: 0;
}
</style>
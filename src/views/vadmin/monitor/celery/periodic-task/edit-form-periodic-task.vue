<template>
  <small-dialog
    ref="dialog"
    v-model="dialogVisible"
    :dialog-title="dialogTitle"
    :width="width"
    :close-on-click-modal="false"
    :append-to-body="true"
    icon="svg:icon-interface"
    @confirm="handleSubmit"
    @closed="dialogClose"
    @opened="dialogOpen"
  >
    <el-form ref="form" v-loading="loading" :model="form" :size="$ELEMENT.size" label-width="170px">
      <el-form-item :rules="[{ required: true, message: 'Tác vụ không được để trống'}]" label="celery:" prop="task">
        <el-autocomplete
          v-model="form.task"
          :fetch-suggestions="querySearch"
          class="inline-input"
          filterable
          placeholder="celery"
          style="width: 400px;"
          @select="handleSelect"
        >
          <template slot-scope="{ item }">
            <div class="name">{{ item }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: 'Tên là bắt buộc'}]" prop="name" label="Tên:">
        <el-input v-model="form.name" placeholder="Ví dụ: tác vụ đồng bộ hóa XXX" style="width: 400px;" />
      </el-form-item>
      <el-form-item prop="interval" label="Tác vụ tần suất:">
        <el-select v-model="form.interval" placeholder="Vui lòng chọn tần suất tác vụ" style="width: 400px;" @change="form.crontab = ''">
          <el-option
            v-for="(item,index) in Interval"
            :key="index"
            :label="getIntervalData(item)"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="crontab" label="Thời gian tác vụ:">
        <el-select v-model="form.crontab" placeholder="Vui lòng chọn thời gian tác vụ" style="width: 400px;" @change="form.interval = ''">
          <el-option
            v-for="(item,index) in Crontab"
            :key="index"
            :label="getCrontabData(item)"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="enabled" label="Có mở không:">
        <template>
          <el-radio-group v-model="form.enabled">
            <el-radio :label="true">Có</el-radio>
            <el-radio :label="false">Không</el-radio>
          </el-radio-group>
        </template>
      </el-form-item>
    </el-form>
  </small-dialog>
</template>
<script>
import * as SyncDataApi from "@/api/vadmin/monitor/celery";
export default {
  props: {
    entity: { type: Object, default: null },
    value: { type: Boolean, default: null },
    create: { type: Boolean, default: false },
    width: { type: String, default: "50%" },
    tags: { type: Array, default: () => [] }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      form: {
        task: "",
        name: "",
        interval: "",
        crontab: "",
        date: "",
        enabled: false
      },
      tasks_as_choices: [],
      Crontab: [],
      Interval: []
    };
  },
  computed: {
    dialogTitle() {
      return this.create ? "Nhiệm vụ mới" : "Chỉnh sửa";
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("input", val);
      if (!this.Crontab[0]) {
        this.Crontab = this.$store.state.Crontab;
        console.log(1, this.Crontab);
      }
      if (!this.Interval[0]) {
        this.Interval = this.$store.state.Interval;
        console.log(2, this.Interval);
      }
    }
  },
  created() {
    SyncDataApi.TasksAsChoices().then((response) => {
      this.tasks_as_choices = response.data || [];
    });
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.tasks_as_choices;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      cb(results);
    }, createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      };
    },
    handleSelect(item) {
      this.form.task = item;
    },
    dialogOpen() {
      if (!this.create) {
        this.form = { ...this.entity };
      }
    },
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          const data = { ...this.form };
          if (this.create) {
            delete data["instanceId"];
            SyncDataApi.createPeriodicTask(data).then(response => {
              this.loading = false;
              this.$emit("success", response.data);
              this.dialogClose();
              this.msgSuccess("Thêm thành công!");
            }).catch(() => {
              this.loading = false;
            });
          } else {
            SyncDataApi.updatePeriodicTask(data).then(response => {
              this.$emit("success", response.data);
              this.loading = false;
              this.msgSuccess("Hoàn thành cập nhật!");
              this.dialogClose();
            }).catch(() => {
              this.loading = false;
            });
          }
        } else {
          return false;
        }
      });
    },
    dialogClose() {
      this.$refs["form"].resetFields();
      this.dialogVisible = false;
    }
  }
};
</script>
<style>
    .el-picker-panel {
        color: #606266;
        border: 1px solid #E4E7ED;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        background: #FFF;
        border-radius: 4px;
        line-height: 5px!important;
        margin: 5px 0;
    }
    .el-picker-panel__content {
         margin: 15px;
    }
</style>


<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="70px">
      <el-form-item label="Tên" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="Vui lòng nhập tên truyện"
          clearable
          size="small"
          style="width: 200px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Thể loại" prop="type">
        <el-input
          v-model="queryParams.type"
          placeholder="Vui lòng nhập thể loại"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">Tìm kiếm</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">Làm mới</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:book:data:post']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >Thêm mới</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:book:data:{id}:put']"
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >Chỉnh sửa</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:book:data:{id}:delete']"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >Delete</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:book:data:export:get']"
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >Xuất dữ liệu</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:book:data:clearcache:delete']"
          type="danger"
          plain
          icon="el-icon-refresh"
          size="mini"
          @click="handleClearCache"
        >Xóa cache</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" width="100" />
      <el-table-column label="Tên" align="center" prop="title" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="hasPermi(['system:book:chapter:get']) ?'/book/chapter/data/' + scope.row.id :'#'" class="link-type">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="Thể loại" align="center" prop="type" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="Trạng thái" align="center" prop="status" />
      <el-table-column label="Author" align="center" prop="author" :show-overflow-tooltip="true" />
      <el-table-column label="Thời gian tạo" align="center" prop="date_added" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.date_added }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="hasPermi(['system:book:data:{id}:put','system:book:data:{id}:delete'])"
        label="Hành động"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['system:book:data:{id}:put']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >Chỉnh sửa</el-button>
          <el-button
            v-hasPermi="['system:book:data:{id}:delete']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >Xóa</el-button>
          <div style="margin: 5px"></div>
          <router-link :to="hasPermi(['rec:cb:item:{id}:get']) ? '/book/' + scope.row.id + '/recommender/' :'#'">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document"
            >Suggest</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title_name="title_name" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="Tên" prop="title">
          <el-input v-model="form.title" placeholder="Nhập tên truyện" />
        </el-form-item>
        <el-form-item label="Author" prop="author">
          <el-input v-model="form.author" placeholder="Nhập tên tác giả"></el-input>
        </el-form-item>
        <el-form-item label="Thể loại" prop="type">
          <el-input v-model="form.type" placeholder="Nhập thể loại truyện" />
        </el-form-item>
        <el-col :span="24">
          <el-form-item label="Miêu tả" prop="description">
            <editor v-model="form.content" :min-height="192" />
          </el-form-item>
        </el-col>
        <el-form-item label="Tệp dữ liệu">
          <input id="zip" type="file" @change="getFiles($event)" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit($event)">Gửi</el-button>
        <el-button @click="cancel">Hủy</el-button>
      </div>
    </el-dialog>

    <el-divider />

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-divider />
  </div>
</template>

<script>
import { listBook, getBook, updateBook, delBook, exportBook, clearCache } from "@/api/vadmin/system/book/data";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import Editor from "@/components/Editor";
import FileUpload from "@/components/FileUpload/index";

export default {
  name: "Book",
  components: { FileUpload, PieChart, BarChart, Editor },
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      typeList: [],
      title_name: "",
      open: false,
      statusOptions: [],
      dateRange: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        thumbnail: undefined,
        author: undefined,
        status: undefined,
        type: undefined,
        like_count: undefined,
        view_count: undefined,
        star: undefined,
        is_enable: undefined,
        is_vip: undefined,
        is_full: undefined,
        is_suggest: undefined
      },
      form: {},
      rules: {
        title: [
          { required: true, message: "Tên truyện không thể viết thiếu", trigger: "blur" }
        ],
        type: [
          { required: true, message: "Thể loại không thể thiếu", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    getFiles(event) {
      this.files = event.target.files[0];
      const urls = this.files;
      console.log(urls);
      console.log(this.files);
    },
    getList() {
      this.loading = true;
      console.log("AAAA: " + JSON.stringify(this.queryParams));
      listBook(this.queryParams).then(response => {
        this.typeList = response.data.results;
        console.log(response);
        this.total = response.data.count;
        this.loading = false;
      }
      );
    },
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // Cancel
    cancel() {
      this.open = false;
      this.reset();
    },
    // Reset
    reset() {
      this.form = {
        id: undefined,
        title: undefined,
        thumbnail: undefined,
        author: undefined,
        status: undefined,
        type: undefined,
        like_count: undefined,
        view_count: undefined,
        star: undefined,
        is_enable: undefined,
        is_vip: undefined,
        is_full: undefined,
        is_suggest: undefined
      };
      this.resetForm("form");
    },
    /** Nút tìm kiếm hoạt động */
    handleQuery() {
      // this.queryParams.title = this.title
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** Reset query */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** Add truyện */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title_name = "Thêm mới truyện";
    },
    // Chọn dữ liệu
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** Update data */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getBook(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title_name = "Chỉnh sửa truyện";
      });
    },
    /** Submit form */
    submit(event) {
      event.preventDefault();
      const formData = new FormData();
      formData.append("id", this.form.id);
      formData.append("title", this.form.title);
      formData.append("author", this.form.author);
      formData.append("type", this.form.type);
      formData.append("description", this.form.content);
      formData.append("file", this.files);
      if (this.form.id !== undefined) {
        if (this.form.title == undefined) {
          this.msgError("Chưa có đủ dữ liệu");
        } else {
          updateBook(formData).then((response) => {
            this.msgSuccess("Chỉnh sửa dữ liệu thành công");
            this.open = false;
            this.getList();
          });
        }
      } else {
        if (this.form.title == undefined) {
          this.msgError("Chưa có đủ dữ liệu");
        } else {
          updateBook(formData).then((response) => {
            this.msgSuccess("Thêm mới dữ liệu thành công");
            this.open = false;
            this.getList();
          });
        }
      }
    },
    // submitForm: function() {
    //   this.$refs["form"].validate(valid => {
    //     if (valid) {
    //       if (this.form.id !== undefined) {
    //         updateBook(this.form).then(response => {
    //           this.msgSuccess("Chỉnh sửa thành công");
    //           this.open = false;
    //           this.getList();
    //         });
    //       } else {
    //         addBook(this.form).then(response => {
    //           this.msgSuccess("Thêm mới thành công");
    //           this.open = false;
    //           this.getList();
    //         });
    //       }
    //     }
    //   });
    // },
    /** Xóa data */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('Bạn có muốn xóa truyện không"' + ids + '"Mục dữ liệu?', "Cảnh báo", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
        type: "warning"
      }).then(function() {
        return delBook(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("Xóa truyện thành công");
      });
    },
    handleSuggest(row) {
      const ids = row.id;
      console.log("Id is: " + ids);
    },
    /** Xuất dữ liệu */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("Bạn có chắc muốn export tất cả các loại dữ liệu?", "Cảnh báo", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
        type: "warning"
      }).then(function() {
        return exportBook(queryParams);
      }).then(response => {
        this.download(response.data.file_url, response.data.name);
      });
    },
    /** Thao tác xóa bộ nhớ cache */
    handleClearCache() {
      clearCache().then(response => {
        this.msgSuccess("Xóa cache thành công");
      });
    }
  }
};
</script>

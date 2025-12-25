# Примеры использования API на Frontend

Базовый URL: `http://localhost:3000`

## 🚀 Настройка Axios

```javascript
import axios from "axios";

// Создание экземпляра axios с базовым URL
const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Добавление токена к каждому запросу (interceptor)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ошибок (interceptor)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или невалиден
      localStorage.removeItem("token");
      // Перенаправление на страницу входа
    }
    return Promise.reject(error);
  }
);
```

## 📦 Продукты

### Получить все продукты (Axios)

```javascript
// Без фильтров
axios
  .get("http://localhost:3000/products")
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));

// С фильтрами
axios
  .get("http://localhost:3000/products", {
    params: {
      gender: "male",
      size: "M",
      categoryId: 1,
      brandId: 3,
      color: "red",
    },
  })
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));

// С async/await
try {
  const response = await axios.get("http://localhost:3000/products", {
    params: { gender: "male", size: "M" },
  });
  console.log(response.data);
} catch (error) {
  console.error(error);
}
```

### Получить продукт по ID (Axios)

```javascript
axios
  .get("http://localhost:3000/products/1")
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));

// С async/await
try {
  const response = await axios.get("http://localhost:3000/products/1");
  console.log(response.data);
} catch (error) {
  console.error(error.response?.data || error.message);
}
```

### Загрузить изображение продукта (Axios)

```javascript
const formData = new FormData();
formData.append("image", fileInput.files[0]); // fileInput - элемент <input type="file">

axios
  .post("http://localhost:3000/products/1/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));

// С async/await
try {
  const formData = new FormData();
  formData.append("image", fileInput.files[0]);

  const response = await axios.post(
    "http://localhost:3000/products/1/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(response.data);
} catch (error) {
  console.error(error.response?.data || error.message);
}
```

### Получить все продукты (Fetch - для сравнения)

```javascript
// Без фильтров
fetch("http://localhost:3000/products")
  .then((res) => res.json())
  .then((data) => console.log(data));

// С фильтрами
fetch(
  "http://localhost:3000/products?gender=male&size=M&categoryId=1&brandId=3&color=red"
)
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### Получить продукт по ID (Fetch - для сравнения)

```javascript
fetch("http://localhost:3000/products/1")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### Загрузить изображение продукта (Fetch - для сравнения)

```javascript
const formData = new FormData();
formData.append("image", fileInput.files[0]); // fileInput - элемент <input type="file">

fetch("http://localhost:3000/products/1/image", {
  method: "POST",
  body: formData,
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

## 🔐 Аутентификация

### Регистрация (Axios)

```javascript
axios
  .post("http://localhost:3000/auth/register", {
    email: "user@example.com",
    password: "password123",
    name: "John Doe",
  })
  .then((response) => {
    console.log(response.data);
    // Сохраните token в localStorage или state
    localStorage.setItem("token", response.data.token);
  })
  .catch((error) => {
    console.error(error.response?.data || error.message);
  });

// С async/await
try {
  const response = await axios.post("http://localhost:3000/auth/register", {
    email: "user@example.com",
    password: "password123",
    name: "John Doe",
  });
  localStorage.setItem("token", response.data.token);
  console.log("Registration successful");
} catch (error) {
  console.error(error.response?.data || error.message);
}
```

### Вход (Axios)

```javascript
axios
  .post("http://localhost:3000/auth/login", {
    email: "user@example.com",
    password: "password123",
  })
  .then((response) => {
    console.log(response.data);
    localStorage.setItem("token", response.data.token);
  })
  .catch((error) => {
    console.error(error.response?.data || error.message);
  });

// С async/await
try {
  const response = await axios.post("http://localhost:3000/auth/login", {
    email: "user@example.com",
    password: "password123",
  });
  localStorage.setItem("token", response.data.token);
  console.log("Login successful");
} catch (error) {
  console.error(error.response?.data || error.message);
}
```

### Регистрация (Fetch - для сравнения)

```javascript
fetch("http://localhost:3000/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
    name: "John Doe",
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    // Сохраните token в localStorage или state
    localStorage.setItem("token", data.token);
  });
```

### Вход (Fetch - для сравнения)

```javascript
fetch("http://localhost:3000/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    localStorage.setItem("token", data.token);
  });
```

## 🛒 Корзина (требует авторизации)

### Получить корзину (Axios)

```javascript
// С использованием interceptor (токен добавляется автоматически)
axios
  .get("http://localhost:3000/cart")
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error.response?.data || error.message));

// Или с явным указанием токена
const token = localStorage.getItem("token");
axios
  .get("http://localhost:3000/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));

// С async/await
try {
  const response = await axios.get("http://localhost:3000/cart");
  console.log(response.data);
} catch (error) {
  console.error(error.response?.data || error.message);
}
```

### Добавить товар в корзину (Axios)

```javascript
axios
  .post("http://localhost:3000/cart", {
    productId: "1",
    quantity: 2,
  })
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error.response?.data || error.message));

// С async/await
try {
  const response = await axios.post("http://localhost:3000/cart", {
    productId: "1",
    quantity: 2,
  });
  console.log(response.data);
} catch (error) {
  console.error(error.response?.data || error.message);
}
```

### Удалить товар из корзины (Axios)

```javascript
axios
  .delete("http://localhost:3000/cart/1")
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error.response?.data || error.message));

// С async/await
try {
  const response = await axios.delete("http://localhost:3000/cart/1");
  console.log(response.data);
} catch (error) {
  console.error(error.response?.data || error.message);
}
```

### Очистить корзину (Axios)

```javascript
axios
  .post("http://localhost:3000/cart/clear")
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error.response?.data || error.message));

// С async/await
try {
  const response = await axios.post("http://localhost:3000/cart/clear");
  console.log(response.data);
} catch (error) {
  console.error(error.response?.data || error.message);
}
```

### Получить корзину (Fetch - для сравнения)

```javascript
const token = localStorage.getItem("token");

fetch("http://localhost:3000/cart", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### Добавить товар в корзину (Fetch - для сравнения)

```javascript
const token = localStorage.getItem("token");

fetch("http://localhost:3000/cart", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    productId: "1",
    quantity: 2,
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### Удалить товар из корзины (Fetch - для сравнения)

```javascript
const token = localStorage.getItem("token");

fetch("http://localhost:3000/cart/1", {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### Очистить корзину (Fetch - для сравнения)

```javascript
const token = localStorage.getItem("token");

fetch("http://localhost:3000/cart/clear", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

## 📂 Категории

### Получить все категории (Axios)

```javascript
axios
  .get("http://localhost:3000/categories")
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));

// С async/await
try {
  const response = await axios.get("http://localhost:3000/categories");
  console.log(response.data);
} catch (error) {
  console.error(error);
}
```

### Создать категорию (Axios)

```javascript
axios
  .post("http://localhost:3000/categories", {
    name: "Новая категория",
  })
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error.response?.data || error.message));

// С async/await
try {
  const response = await axios.post("http://localhost:3000/categories", {
    name: "Новая категория",
  });
  console.log(response.data);
} catch (error) {
  console.error(error.response?.data || error.message);
}
```

### Получить все категории (Fetch - для сравнения)

```javascript
fetch("http://localhost:3000/categories")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### Создать категорию (Fetch - для сравнения)

```javascript
fetch("http://localhost:3000/categories", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Новая категория",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

## 🏷️ Бренды

### Получить все бренды (Axios)

```javascript
axios
  .get("http://localhost:3000/brands")
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));

// С async/await
try {
  const response = await axios.get("http://localhost:3000/brands");
  console.log(response.data);
} catch (error) {
  console.error(error);
}
```

### Создать бренд (Axios)

```javascript
axios
  .post("http://localhost:3000/brands", {
    name: "Новый бренд",
  })
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error.response?.data || error.message));

// С async/await
try {
  const response = await axios.post("http://localhost:3000/brands", {
    name: "Новый бренд",
  });
  console.log(response.data);
} catch (error) {
  console.error(error.response?.data || error.message);
}
```

### Получить все бренды (Fetch - для сравнения)

```javascript
fetch("http://localhost:3000/brands")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### Создать бренд (Fetch - для сравнения)

```javascript
fetch("http://localhost:3000/brands", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Новый бренд",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

## 🔍 Health Check

### Axios

```javascript
axios
  .get("http://localhost:3000/health")
  .then((response) => console.log(response.data)) // { status: "ok" }
  .catch((error) => console.error(error));
```

### Fetch

```javascript
fetch("http://localhost:3000/health")
  .then((res) => res.json())
  .then((data) => console.log(data)); // { status: "ok" }
```

---

## 📚 Класс-обертка для работы с API (Axios)

```javascript
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

class ApiClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Добавление токена к каждому запросу
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Обработка ошибок
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          // Перенаправление на страницу входа
        }
        return Promise.reject(error);
      }
    );
  }

  // Продукты
  async getProducts(filters = {}) {
    const response = await this.client.get("/products", { params: filters });
    return response.data;
  }

  async getProduct(id) {
    const response = await this.client.get(`/products/${id}`);
    return response.data;
  }

  async uploadProductImage(productId, imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await this.client.post(
      `/products/${productId}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Аутентификация
  async register(email, password, name) {
    const response = await this.client.post("/auth/register", {
      email,
      password,
      name,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  }

  async login(email, password) {
    const response = await this.client.post("/auth/login", {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  }

  // Корзина
  async getCart() {
    const response = await this.client.get("/cart");
    return response.data;
  }

  async addToCart(productId, quantity) {
    const response = await this.client.post("/cart", {
      productId,
      quantity,
    });
    return response.data;
  }

  async removeFromCart(productId) {
    const response = await this.client.delete(`/cart/${productId}`);
    return response.data;
  }

  async clearCart() {
    const response = await this.client.post("/cart/clear");
    return response.data;
  }

  // Категории
  async getCategories() {
    const response = await this.client.get("/categories");
    return response.data;
  }

  async createCategory(name) {
    const response = await this.client.post("/categories", { name });
    return response.data;
  }

  // Бренды
  async getBrands() {
    const response = await this.client.get("/brands");
    return response.data;
  }

  async createBrand(name) {
    const response = await this.client.post("/brands", { name });
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get("/health");
    return response.data;
  }
}

// Создание экземпляра
const api = new ApiClient(API_BASE_URL);

// Пример использования
async function loadProducts() {
  try {
    const products = await api.getProducts({ gender: "male", size: "M" });
    console.log("Products:", products);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

async function loginUser() {
  try {
    const result = await api.login("user@example.com", "password123");
    console.log("Logged in successfully", result);
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
  }
}

export default api;
```

## Пример с async/await (Fetch)

```javascript
// Утилита для работы с API через fetch
const API_BASE_URL = "http://localhost:3000";

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    // Удаляем Content-Type для FormData
    if (options.body instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  }

  // Продукты
  async getProducts(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/products${queryString ? `?${queryString}` : ""}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async uploadProductImage(productId, imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);
    return this.request(`/products/${productId}/image`, {
      method: "POST",
      body: formData,
    });
  }

  // Аутентификация
  async register(email, password, name) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // Корзина
  async getCart() {
    return this.request("/cart");
  }

  async addToCart(productId, quantity) {
    return this.request("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId) {
    return this.request(`/cart/${productId}`, {
      method: "DELETE",
    });
  }

  async clearCart() {
    return this.request("/cart/clear", {
      method: "POST",
    });
  }

  // Категории
  async getCategories() {
    return this.request("/categories");
  }

  // Бренды
  async getBrands() {
    return this.request("/brands");
  }
}

// Использование
const api = new ApiClient(API_BASE_URL);

// Пример использования
async function loadProducts() {
  try {
    const products = await api.getProducts({ gender: "male", size: "M" });
    console.log("Products:", products);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function loginUser() {
  try {
    const result = await api.login("user@example.com", "password123");
    localStorage.setItem("token", result.token);
    console.log("Logged in successfully");
  } catch (error) {
    console.error("Login failed:", error);
  }
}
```

## React пример (Axios)

```jsx
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        setProducts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>Price: ${product.price}</p>
          {product.image && (
            <img
              src={`${API_BASE_URL}${product.image}`}
              alt={product.title}
              style={{ width: "200px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Пример с фильтрами
function FilteredProducts() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ gender: "", size: "" });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const params = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        );
        const response = await axios.get(`${API_BASE_URL}/products`, {
          params,
        });
        setProducts(response.data);
      } catch (err) {
        console.error("Error:", err);
      }
    }

    fetchProducts();
  }, [filters]);

  return (
    <div>
      <select
        value={filters.gender}
        onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
      >
        <option value="">All genders</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      {/* Список продуктов */}
      {products.map((product) => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}
```

## React пример (Fetch - для сравнения)

```jsx
import { useState, useEffect } from "react";

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:3000/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>Price: ${product.price}</p>
          {product.image && (
            <img
              src={`http://localhost:3000${product.image}`}
              alt={product.title}
              style={{ width: "200px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
```

## Vue пример (Axios)

```vue
<template>
  <div>
    <h1>Products</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <div v-for="product in products" :key="product.id">
        <h3>{{ product.title }}</h3>
        <p>Price: ${{ product.price }}</p>
        <img
          v-if="product.image"
          :src="`${apiBaseUrl}${product.image}`"
          :alt="product.title"
          style="width: 200px"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      products: [],
      loading: true,
      error: null,
      apiBaseUrl: "http://localhost:3000",
    };
  },
  async mounted() {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/products`);
      this.products = response.data;
    } catch (error) {
      this.error = error.response?.data?.message || "Failed to load products";
      console.error("Error fetching products:", error);
    } finally {
      this.loading = false;
    }
  },
};
</script>
```

## Vue пример (Fetch - для сравнения)

```vue
<template>
  <div>
    <h1>Products</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="product in products" :key="product.id">
        <h3>{{ product.title }}</h3>
        <p>Price: ${{ product.price }}</p>
        <img
          v-if="product.image"
          :src="`http://localhost:3000${product.image}`"
          :alt="product.title"
          style="width: 200px"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      loading: true,
    };
  },
  async mounted() {
    try {
      const response = await fetch("http://localhost:3000/products");
      this.products = await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      this.loading = false;
    }
  },
};
</script>
```

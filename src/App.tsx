import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeleteAp, GetAll, PostAp, EditAp } from "./service/api";
import { useState } from "react";
import type { Product } from "./type/shablon";

function App() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["Get"],
    queryFn: GetAll,
  });

  const Delete = useMutation({
    mutationFn: DeleteAp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Get"],
      });
    },
  });

  const Post = useMutation({
    mutationFn: PostAp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Get"],
      });

      setAdd(false);
      setFormData({
        title: "",
        description: "",
        price: 0,
      });
    },
  });

  const Edit = useMutation({
    mutationFn: ({
      id,
      product,
    }: {
      id: number;
      product: Omit<Product, "id">;
    }) => EditAp(id, product),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Get"],
      });

      setEdit(null);
      setFormData({
        title: "",
        description: "",
        price: 0,
      });
    },
  });

  const [add, setAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<null | Product>(null);

  const [formData, setFormData] = useState<Omit<Product, "id">>({
    title: "",
    description: "",
    price: 0,
  });

  if (isLoading) return <h2>Loading...</h2>;

  if (isError) return <h2>{error.message}</h2>;

  return (
    <div>
      {add || edit ? (
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();

            if (edit) {
              Edit.mutate({
                id: Number(edit.id),
                product: formData,
              });
            } else {
              Post.mutate(formData);
            }
          }}
        >
          <input
            className="input"
            type="text"
            placeholder="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
            required
          />

          <input
            className="input"
            type="number"
            placeholder="price"
            value={formData.price}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: Number(e.target.value),
              })
            }
            required
          />

          <input
            className="input"
            type="text"
            placeholder="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            required
          />

          <button type="submit" disabled={Post.isPending || Edit.isPending}>
            {Edit.isPending || Post.isPending
              ? "Saving..."
              : edit
                ? "Update"
                : "Submit"}
          </button>
        </form>
      ) : null}

      <button
        onClick={() => {
          setAdd(true);
          setEdit(null);

          setFormData({
            title: "",
            description: "",
            price: 0,
          });
        }}
      >
        Add
      </button>

      {data?.map((item) => (
        <div key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.price}</p>
          <p>{item.description}</p>

          <button
            onClick={() => {
              Delete.mutate(Number(item.id));
            }}
          >
            Delete
          </button>

          <button
            onClick={() => {
              setEdit(item);
              setAdd(false);

              setFormData({
                title: item.title,
                description: item.description,
                price: item.price,
              });
            }}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "./FormCreateOrUpdateProd";

export default function CreateProductButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Criar Produto
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-2 top-2 text-xl"
              aria-label="Fechar formulário"
            >
              X
            </button>

            <ProductForm />
          </div>
        </div>
      )}
    </>
  );
}
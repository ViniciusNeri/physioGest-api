import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { injectable } from 'tsyringe';

@injectable()
export class SupabaseStorageProvider {
  private client: SupabaseClient;
  private bucket: string;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_KEY || '';
    this.bucket = process.env.SUPABASE_BUCKET_ATTACHMENTS || '';

    this.client = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Faz o upload físico de um arquivo na memória (Buffer) para o Supabase Storage.
   * @param patientId O ID do paciente para criar pastas organizadas.
   * @param fileNameNome O nome do arquivo com a extensão.
   * @param fileBuffer O Buffer gerado pelo multer.
   * @param mimeType O mimeType do arquivo (ex: application/pdf)
   * @returns Retorna a Public URL gerada pelo provedor de storage.
   */
  async uploadFile(patientId: string, fileName: string, fileBuffer: Buffer, mimeType: string): Promise<string> {
    try {
      const sanitizedFilename = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${patientId}/${Date.now()}-${sanitizedFilename}`;

      const { data, error } = await this.client.storage
        .from(this.bucket)
        .upload(filePath, fileBuffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (error) {
        throw new Error(`Erro ao fazer upload no Supabase: ${error.message}`);
      }

      const { data: publicData } = this.client.storage
        .from(this.bucket)
        .getPublicUrl(data.path);

      return publicData.publicUrl;
    } catch (err: any) {
      throw new Error(`Falha no upload do anexo: ${err.message}`);
    }
  }

  /**
   * Deleta um arquivo fisicamente do bucket do Supabase usando seu caminho final.
   * @param fileUrl URL Publica salva no banco
   */
  async deleteFileByUrl(fileUrl: string): Promise<void> {
    try {
      // Isola o path da exclusão da publicURL gerada padrão do supabase
      const urlParts = fileUrl.split(`/${this.bucket}/`);
      if (urlParts.length !== 2) return;

      const filePath = urlParts[1];

      const { error } = await this.client.storage
        .from(this.bucket)
        .remove([filePath]);

      if (error) {
        throw new Error(`Erro ao deletar arquivo no Supabase: ${error.message}`);
      }
    } catch (err: any) {
      throw new Error(`Falha ao remover o anexo: ${err.message}`);
    }
  }
}

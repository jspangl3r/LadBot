""" File responsible for training a GPT-2 model on a discord user's dataset. """

import gpt_2_simple as gpt2
import tensorflow as tf
import sys
import os

def train(file_path: str):
  model_name = "124M"
  model_dir = "../data/train/models"

  # Start training session.
  os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
  gpu_options = tf.GPUOptions(per_process_gpu_memory_fraction=0.25)
  sess = tf.InteractiveSession(config=tf.ConfigProto(gpu_options=gpu_options))
  gpt2.finetune(sess,
                file_path,
                steps=5,
                model_name=model_name,
                model_dir=os.path.join(model_dir))

def main():
  train(str(sys.argv[1]))

if __name__ == "__main__":
  main()